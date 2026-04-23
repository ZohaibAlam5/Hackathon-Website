import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "node:crypto";

type DbWishlistRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string | null;
};

type SyncItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
};

function rowsToItems(rows: DbWishlistRow[]) {
  return rows.map((r) => ({
    id: r.id,
    productId: r.product_id,
    name: r.name,
    price: r.price,
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
      `SELECT id, product_id, name, price, image FROM wishlist_items WHERE user_id = ? ORDER BY created_at ASC`,
    )
    .all(userId) as DbWishlistRow[];
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
    `INSERT OR IGNORE INTO wishlist_items (id, user_id, product_id, name, price, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const clear = db.prepare(`DELETE FROM wishlist_items WHERE user_id = ?`);

  const tx = db.transaction((items: SyncItem[]) => {
    if (mode === "replace") clear.run(userId);
    for (const it of items) {
      upsert.run(
        randomUUID(),
        userId,
        it.productId,
        it.name,
        it.price,
        it.image,
      );
    }
  });
  tx(body.items);

  const rows = db
    .prepare(
      `SELECT id, product_id, name, price, image FROM wishlist_items WHERE user_id = ? ORDER BY created_at ASC`,
    )
    .all(userId) as DbWishlistRow[];
  return NextResponse.json({ items: rowsToItems(rows) });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (productId) {
    db.prepare(
      `DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?`,
    ).run(userId, productId);
  } else {
    db.prepare(`DELETE FROM wishlist_items WHERE user_id = ?`).run(userId);
  }
  return NextResponse.json({ ok: true });
}
