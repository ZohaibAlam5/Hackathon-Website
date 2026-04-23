import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "node:crypto";

type DbCartRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

type SyncItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

function rowsToItems(rows: DbCartRow[]) {
  return rows.map((r) => ({
    id: r.id,
    productId: r.product_id,
    name: r.name,
    price: r.price,
    quantity: r.quantity,
    image: r.image,
  }));
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ items: [] });
  const rows = db
    .prepare(
      `SELECT id, product_id, name, price, quantity, image FROM cart_items WHERE user_id = ? ORDER BY created_at ASC`,
    )
    .all(userId) as DbCartRow[];
  return NextResponse.json({ items: rowsToItems(rows) });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { items?: SyncItem[]; mode?: "merge" | "replace" }
    | null;
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const mode = body.mode ?? "merge";

  const upsert = db.prepare(
    `INSERT INTO cart_items (id, user_id, product_id, name, price, quantity, image)
     VALUES (@id, @user_id, @product_id, @name, @price, @quantity, @image)
     ON CONFLICT(user_id, product_id) DO UPDATE SET
       quantity = CASE WHEN @mode = 'merge' THEN cart_items.quantity + excluded.quantity ELSE excluded.quantity END,
       price = excluded.price,
       name = excluded.name,
       image = excluded.image`,
  );
  const clear = db.prepare(`DELETE FROM cart_items WHERE user_id = ?`);

  const tx = db.transaction((items: SyncItem[]) => {
    if (mode === "replace") clear.run(userId);
    for (const it of items) {
      upsert.run({
        id: randomUUID(),
        user_id: userId,
        product_id: it.productId,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
        mode,
      });
    }
  });
  tx(body.items);

  const rows = db
    .prepare(
      `SELECT id, product_id, name, price, quantity, image FROM cart_items WHERE user_id = ? ORDER BY created_at ASC`,
    )
    .all(userId) as DbCartRow[];
  return NextResponse.json({ items: rowsToItems(rows) });
}

export async function DELETE() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);
  return NextResponse.json({ ok: true });
}
