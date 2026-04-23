import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

declare global {
  // eslint-disable-next-line no-var
  var __hekto_db__: Database.Database | undefined;
}

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "hekto.db");

export const db: Database.Database =
  globalThis.__hekto_db__ ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") globalThis.__hekto_db__ = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// App-specific tables (Better Auth manages its own tables in addition).
db.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    UNIQUE(user_id, product_id)
  );
  CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    UNIQUE(user_id, product_id)
  );
  CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    address_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'placed',
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
  );
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
`);
