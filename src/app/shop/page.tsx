"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../Components/component1";
import Foot from "../Components/component2";
import Bottom1 from "../Components/component3";
import { client } from "@/sanity/lib/client";
import Heading from "../Components/component4";

// Define the structure of a product
interface Product {
  ProductID: string;
  ProductName: string;
  imageUrl: string;
  ProductPrice: number;
  ProductDescription: string;
  ProductDiscount?: number;
  ProductBrand: string;
  ProductCategory: string;
}

// Fetch products from Sanity
async function fetchShopProducts(): Promise<Product[]> {
  const query = `*[_type == 'Shop']{
    ProductID,
    ProductName,
    "imageUrl": ProductImage.asset->url,
    ProductPrice,
    ProductDescription,
    ProductDiscount,
    ProductBrand,
    ProductCategory
  }`;
  return await client.fetch(query);
}

// Main Shop Component
function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  // Fetch products when the component mounts
  useEffect(() => {
    async function loadProducts() {
      const data = await fetchShopProducts();
      setProducts(data);
      setFilteredProducts(data); // Set initial filtered products
    }
    loadProducts();
  }, []);

  // Filter products whenever searchQuery, brands, categories, or price changes
  useEffect(() => {
    let filtered = [...products]; // Start with all products

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.ProductName.toLowerCase().includes(searchQuery)
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.ProductBrand)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.ProductCategory)
      );
    }

    // Apply price filter
    if (selectedPrice) {
      const priceRanges: { [key: string]: [number, number] } = {
        "0-150": [0, 150],
        "150-350": [150, 350],
        "350-550": [350, 550],
        "550-650": [550, 650],
        "650-1000": [650, 1000],
        "1000+": [1000, Infinity],
      };
      const [min, max] = priceRanges[selectedPrice];
      filtered = filtered.filter(
        (product) => product.ProductPrice >= min && product.ProductPrice <= max
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedBrands, selectedCategories, selectedPrice, products]);

  // Handle brand filter selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Handle category filter selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div>
      <Header />
      <Heading name="Shop" />

      <div className="flex flex-col md:flex-row container mx-auto px-4 py-8">
        {/* Left Sidebar */}
        <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-600 mb-2">Product Brand</h3>
            <ul className="space-y-1">
              {["Coaster Furniture", "Fusion Dot High Fashion", "Unique Furniture", "Dream Furniture", "Young Repurposed", "Green Furniture"].map(
                (brand) => (
                  <li key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />{" "}
                    {brand}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-600 mb-2">Categories</h3>
            <ul className="space-y-1">
              {["Accessories", "Watches", "Magento", "Clothes", "Furniture"].map(
                (category) => (
                  <li key={category}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />{" "}
                    {category}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-600 mb-2">Price Filter</h3>
            <ul className="space-y-1">
              {[
                ["0-150", "$0 - $150"],
                ["150-350", "$150 - $350"],
                ["350-550", "$350 - $550"],
                ["550-650", "$550 - $650"],
                ["650-1000", "$650 - $1000"],
                ["1000+", "Above $1000"],
              ].map(([value, label]) => (
                <li key={value}>
                  <input
                    type="radio"
                    name="price"
                    value={value}
                    checked={selectedPrice === value}
                    onChange={() => setSelectedPrice(value)}
                  />{" "}
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Section */}
        <main className="flex-1 md:ml-8">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Shop Products</h1>

          {filteredProducts.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.ProductID} className="bg-white rounded-lg shadow p-4">
                  <Link href={`/shop/${product.ProductID}`} passHref>
                    <Image
                      src={product.imageUrl}
                      alt={product.ProductName}
                      className="rounded-md w-full object-cover"
                      width={300}
                      height={200}
                    />
                  </Link>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700">{product.ProductName}</h3>
                    <p className="text-gray-500 text-sm">{product.ProductDescription}</p>
                    <p className="text-gray-800 font-bold mt-2">
                      ${product.ProductDiscount || product.ProductPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Bottom1 />
      <Foot />
    </div>
  );
}

// Export the Shop component wrapped in Suspense
export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}