"use client";
import Header from "../Components/component1";
import Foot from "../Components/component2";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Heading from "../Components/component4";

interface Product {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setProducts(JSON.parse(storedWishlist));
    }
  }, []);

  const removeProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("wishlist", JSON.stringify(updatedProducts));
  };

  const clearwishlist = () => {
    setProducts([]);
    localStorage.removeItem("wishlist");
  };

  return (
    <div>
      <Header />
      <Heading name="Wishlist" />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-4 2x 2xl: justify-center"> 
          <div className="w-full md:w-2/3">
            <div className="overflow-x-auto justify-center">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Product</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2">
                        <div className="flex items-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 mr-4"
                            width={83}
                            height={87}
                          />
                          <div>
                            <div>{product.name}</div>
                            <div className="text-sm text-gray-500">
                              Color: {product.color}
                            </div>
                            <div className="text-sm text-gray-500">
                              Size: {product.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        ${product.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2">
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => removeProduct(product.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap justify-between mt-4 gap-2">
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                onClick={clearwishlist}
              >
                Clear Wishlist
              </button>
            </div>
              <div className="mt-10">
              <Link href="/products">
              <button className="bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-600">
              Continue Shopping
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Foot />
    </div>
  );
}