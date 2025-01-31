"use client";

import Header from "@/app/Components/component1";
import Foot from "@/app/Components/component2";
import Bottom1 from "@/app/Components/component3";
import { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Heading from "@/app/Components/component4";

interface Product {
  ProductID: string;
  ProductName: string;
  ProductImage?: { asset: { _ref: string } };
  ProductPrice: number;
  ProductDescription: string;
  ProductDiscount: number;
  ProductBrand: string;
  ProductCategory: string;
}

interface Params {
  item?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function Home(props: { params: Promise<Params> }) {
  const [params, setParams] = useState<Params>({});
  const [product, setProduct] = useState<Product | null>(null);

  // Resolve dynamic route params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await props.params;
      setParams(resolvedParams);
    }
    resolveParams();
  }, [props.params]);

  // Fetch product data based on resolved params
  useEffect(() => {
    async function fetchProduct() {
      if (params && params.item) {
        try {
          const query = `*[_type == 'Shop' && ProductID == "${params.item}"][0]`;
          const data = await client.fetch(query);
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        }
      } else {
        setProduct(null);
      }
    }
    fetchProduct();
  }, [params]);

  // Add product to cart and persist in localStorage
  const addToCart = (product: Product) => {
    const storedCart = localStorage.getItem("cart");
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
  
    // Check if the product already exists in the cart
    const existingProduct = cart.find((item: CartItem) => item.id === product.ProductID);
    if (existingProduct) {
      existingProduct.quantity += 1; // Increment quantity if it exists
    } else {
      // Add new product with all relevant details
      cart.push({
        id: product.ProductID,
        name: product.ProductName,
        price: product.ProductPrice - product.ProductDiscount,
        quantity: 1,
        image: product.ProductImage ? urlFor(product.ProductImage.asset).url() : null, // Save image URL
      });
    }
  
    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.ProductName} added to cart!`);
  };
  

  const selectedItem = product;
  const image = selectedItem?.ProductImage;

  return (
    <div>
      <Header />
     <Heading name="Product Details"/>

      <div>
        <div className="container mx-auto p-4">
          {selectedItem ? (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                {image ? (
                  <Image
                    src={urlFor(image.asset).url()}
                    alt={selectedItem.ProductName}
                    className="rounded-md w-full h-100 object-cover"
                    width={300}
                    height={200}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="w-full md:w-1/2 md:ml-8">
                <h1 className="text-2xl font-semibold text-gray-800">{selectedItem.ProductName}</h1>
                <p className="text-gray-500 mt-2">{selectedItem.ProductDescription}</p>
                <p className="mt-4 text-gray-800 text-lg font-bold">
                  ${selectedItem.ProductPrice - selectedItem.ProductDiscount}
                </p>
                <p className="text-gray-500 line-through">${selectedItem.ProductPrice}</p>
                <button
                 className="bg-pink-500 text-white py-2 px-6 rounded-full mt-4 hover:bg-pink-600"
                    onClick={() => addToCart(selectedItem)}>
                  Add to Cart
                 </button>
              </div>
            </div>
          ) : (
            <p>Loading product...</p>
          )}
        </div>
      </div>
      <Bottom1 />
      <Foot />
    </div>
  );
}