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
  quantity: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setProducts(JSON.parse(storedCart));
    }
  }, []);

  const updateQuantity = (id: number, quantity: number) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, quantity: quantity || 0 } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const removeProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const clearCart = () => {
    setProducts([]);
    localStorage.removeItem("cart");
  };

  const subtotal = products.reduce(
    (acc, product) => acc + (product.price || 0) * (product.quantity || 0),
    0
  );
  const total = subtotal + 40;

  return (
    <div className="text-sm md:text-base">
      <Header />
      <Heading name="Cart" />
      <div className="container mx-auto p-2 md:p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-2/3">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="py-1 md:py-2 text-left border-b">Product</th>
                    <th className="py-1 md:py-2 text-left border-b">Price</th>
                    <th className="py-1 md:py-2 text-left border-b">Quantity</th>
                    <th className="py-1 md:py-2 text-left border-b">Total</th>
                    <th className="py-1 md:py-2 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-1 md:py-2">
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 md:w-16 md:h-16"
                            width={83}
                            height={87}
                          />
                          <div>
                            <div>{product.name}</div>
                            <div className="text-xs text-gray-500 md:text-sm">
                              Color: {product.color}
                            </div>
                            <div className="text-xs text-gray-500 md:text-sm">
                              Size: {product.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-1 md:py-2">${product.price?.toFixed(2) || "0.00"}</td>
                      <td className="py-1 md:py-2">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              product.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-12 p-1 border rounded md:w-16"
                        />
                      </td>
                      <td className="py-1 md:py-2">
                        ${((product.price || 0) * (product.quantity || 0)).toFixed(2)}
                      </td>
                      <td className="py-1 md:py-2">
                        <button
                          className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 text-xs md:text-sm md:px-2"
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
            <div className="flex flex-wrap justify-between mt-2 md:mt-4 gap-2">
              <button
                className="bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 text-xs md:text-sm md:px-4"
                onClick={() => setProducts(products)}
              >
                Update Cart
              </button>
              <button
                className="bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 text-xs md:text-sm md:px-4"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 mt-2 md:mt-0">
            <div className="bg-gray-100 p-2 md:p-4 rounded">
              <h2 className="text-sm md:text-lg font-bold">Cart Totals</h2>
              <div className="flex justify-between mt-1 md:mt-2">
                <span>Subtotals:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1 md:mt-2">
                <span>Totals Including Shipping:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/ordercompleted">
                <button className="bg-green-500 text-white w-full mt-2 md:mt-4 py-1 md:py-2 rounded hover:bg-green-600 text-xs md:text-sm">
                  Order now
                </button>
              </Link>
            </div>
            <div className="bg-gray-100 p-2 md:p-4 rounded mt-2 md:mt-4">
              <h2 className="text-sm md:text-lg font-bold">Calculate Shipping</h2>
              <input
                type="text"
                placeholder="Country"
                className="w-full p-1 border rounded mb-1 md:mb-2 text-xs md:text-sm"
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-1 border rounded mb-1 md:mb-2 text-xs md:text-sm"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full p-1 border rounded mb-1 md:mb-2 text-xs md:text-sm"
              />
              <button className="bg-pink-500 text-white w-full py-1 md:py-2 rounded hover:bg-pink-600 text-xs md:text-sm">
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>
      <Foot />
    </div>
  );
}
