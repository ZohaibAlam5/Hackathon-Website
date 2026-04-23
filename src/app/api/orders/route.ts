import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "node:crypto";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

type Address = {
  fullName: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

type DbOrderRow = {
  id: string;
  user_id: string;
  items_json: string;
  subtotal: number;
  shipping: number;
  total: number;
  address_json: string;
  status: string;
  created_at: number;
};

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ orders: [] });
  const rows = db
    .prepare(
      `SELECT id, user_id, items_json, subtotal, shipping, total, address_json, status, created_at
       FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(userId) as DbOrderRow[];
  return NextResponse.json({
    orders: rows.map((r) => ({
      id: r.id,
      items: JSON.parse(r.items_json) as OrderItem[],
      subtotal: r.subtotal,
      shipping: r.shipping,
      total: r.total,
      address: JSON.parse(r.address_json) as Address,
      status: r.status,
      createdAt: r.created_at,
    })),
  });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to place an order." },
      { status: 401 },
    );
  }
  const body = (await req.json().catch(() => null)) as
    | { items?: OrderItem[]; address?: Address; shipping?: number }
    | null;
  if (
    !body ||
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    !body.address
  ) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const subtotal = body.items.reduce(
    (s, i) => s + Number(i.price) * Number(i.quantity),
    0,
  );
  const shipping = Number(body.shipping ?? 0);
  const total = subtotal + shipping;
  const id = randomUUID();

  db.prepare(
    `INSERT INTO orders (id, user_id, items_json, subtotal, shipping, total, address_json, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'placed')`,
  ).run(
    id,
    userId,
    JSON.stringify(body.items),
    subtotal,
    shipping,
    total,
    JSON.stringify(body.address),
  );

  // Empty server cart on successful checkout
  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);

  return NextResponse.json({ id, subtotal, shipping, total });
}
