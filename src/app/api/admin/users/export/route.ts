import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: number | null;
  createdAt: number | string;
};

type OrderAgg = { user_id: string; orderCount: number; lifetimeSpend: number };

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const users = db
    .prepare(
      `SELECT id, email, name, emailVerified, createdAt FROM user ORDER BY createdAt DESC`,
    )
    .all() as UserRow[];

  const aggregateRows = db
    .prepare(
      `SELECT user_id, COUNT(*) as orderCount, SUM(total) as lifetimeSpend FROM orders GROUP BY user_id`,
    )
    .all() as OrderAgg[];
  const aggregates = new Map(aggregateRows.map((r) => [r.user_id, r]));

  const wb = new ExcelJS.Workbook();
  wb.creator = "Hekto Admin Export";
  wb.created = new Date();
  const sheet = wb.addWorksheet("Users");
  sheet.columns = [
    { header: "User ID", key: "id", width: 36 },
    { header: "Email", key: "email", width: 32 },
    { header: "Name", key: "name", width: 24 },
    { header: "Email Verified", key: "verified", width: 14 },
    { header: "Orders", key: "orders", width: 10 },
    { header: "Lifetime Spend (USD)", key: "spend", width: 20 },
    { header: "Created", key: "createdAt", width: 24 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const u of users) {
    const agg = aggregates.get(u.id);
    sheet.addRow({
      id: u.id,
      email: u.email,
      name: u.name ?? "",
      verified: u.emailVerified ? "yes" : "no",
      orders: agg?.orderCount ?? 0,
      spend: Number(agg?.lifetimeSpend ?? 0).toFixed(2),
      createdAt: new Date(
        typeof u.createdAt === "number" ? u.createdAt : Date.parse(String(u.createdAt)),
      ).toISOString(),
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const filename = `hekto-users-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
