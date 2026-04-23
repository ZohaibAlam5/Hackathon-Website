import { client } from "@/sanity/lib/client";

export type SanityImage = { asset: { _ref: string; _type: string } };

export type Product = {
  _id: string;
  ProductID: string;
  ProductName: string;
  ProductImage?: SanityImage;
  imageUrl?: string;
  ProductPrice: number;
  ProductDescription?: string;
  ProductDiscount?: number;
  ProductFeatured?: boolean;
  ProductCategory?: string;
};

export type Category = {
  _id: string;
  ProductCategory: string;
  ProductCategoryImage?: SanityImage;
  imageUrl?: string;
};

const PRODUCT_PROJECTION = `{
  _id,
  ProductID,
  ProductName,
  ProductImage,
  "imageUrl": ProductImage.asset->url,
  "ProductPrice": coalesce(ProductPrice, "0"),
  ProductDescription,
  "ProductDiscount": coalesce(ProductDiscount, "0"),
  ProductFeatured,
  "ProductCategory": coalesce(Productcategory, ProductCategory)
}`;

function coerceNumbers(rows: Product[]): Product[] {
  return rows.map((p) => ({
    ...p,
    ProductPrice: Number(p.ProductPrice) || 0,
    ProductDiscount: Number(p.ProductDiscount) || 0,
  }));
}

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    return (await client.fetch(query, params, { next: { revalidate: 60 } })) as T;
  } catch (err) {
    console.error("[sanity] fetch failed:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await safeFetch<Product[]>(
    `*[_type == "Shop"] | order(_createdAt desc)${PRODUCT_PROJECTION}`,
    {},
    [],
  );
  return coerceNumbers(rows);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await safeFetch<Product[]>(
    `*[_type == "Shop" && ProductFeatured == true] | order(_createdAt desc)[0...$limit]${PRODUCT_PROJECTION}`,
    { limit },
    [],
  );
  return coerceNumbers(rows);
}

export async function getLatestProducts(limit = 6): Promise<Product[]> {
  const rows = await safeFetch<Product[]>(
    `*[_type == "Shop"] | order(_createdAt desc)[0...$limit]${PRODUCT_PROJECTION}`,
    { limit },
    [],
  );
  return coerceNumbers(rows);
}

export async function getProductById(id: string): Promise<Product | null> {
  const data = await safeFetch<Product | null>(
    `*[_type == "Shop" && ProductID == $id][0]${PRODUCT_PROJECTION}`,
    { id },
    null,
  );
  if (!data) return null;
  return coerceNumbers([data])[0];
}

export async function getRelatedProducts(
  category: string | undefined,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  if (!category) return [];
  const rows = await safeFetch<Product[]>(
    `*[_type == "Shop" && (Productcategory == $category || ProductCategory == $category) && ProductID != $excludeId][0...$limit]${PRODUCT_PROJECTION}`,
    { category, excludeId, limit },
    [],
  );
  return coerceNumbers(rows);
}

export async function getCategories(): Promise<Category[]> {
  return safeFetch<Category[]>(
    `*[_type == "Products"]{
      _id,
      ProductCategory,
      ProductCategoryImage,
      "imageUrl": ProductCategoryImage.asset->url
    }`,
    {},
    [],
  );
}
