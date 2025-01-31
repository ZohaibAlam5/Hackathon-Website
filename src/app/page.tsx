
import Header from "./Components/component1";
import Foot from "./Components/component2";
import Image from "next/image";
import home1 from "../app/images/home1.png"
import sofa from "./images/unique feature sofa.png"
import Bottom1 from "./Components/component3";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function Home() {
  return (
<div>
  
  <Header/>
  <div>
  <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-purple-100 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="flex flex-col items-start md:w-1/2">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-pink-500 rounded-full mr-2"></div>
          <p className="text-red-500 font-semibold">Best Furniture For Your Castle...</p>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">New Furniture Collection Trends in 2020</h1>
        <p className="text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.</p>
        <Link href="/shop"><button className="bg-pink-500 text-white py-2 px-6 rounded-full hover:">Shop Now</button></Link>
      </div>
      <div className="relative md:w-1/2 mt-8 md:mt-0">
        <Image src={home1} alt="Chair" className="w-60 h-auto" />
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-lg font-bold p-2 rounded-full transform translate-x-1/2 -translate-y-1/2">
          50% off
        </div>
      </div>
      </div>
      {/* Featured Products */}
      <section className="w-4/5 mx-auto mt-16">
        <h3 className="text-center text-2xl font-bold mb-6">Featured Products</h3>
        <Link href="/shop"><div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Product Cards */}
          {[
            { id:7, name: "Comfort Chair", price: "$42.00" },
            { id:8, name: "Comfort Chair", price: "$42.00" },
            { id:9, name: "Comfort Chair", price: "$42.00" },
            { id:14, name: "Comfort Chair", price: "$42.00" },
          ].map((product, index) => (
            <div
              key={product.id}
              className={`relative border rounded-lg p-4 shadow-md ${
                index === 1 ? "border-2 border-[#FF3E66]" : ""
              }`}
            >
              <Image
                src={`/chair-${product.id}.png`}
                alt={product.name}
                className=" object-cover mb-4"
                width={200}
                height={200}
              /> 
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-gray-500">{product.price}</p>
              {index === 1 && (
                <button className="absolute top-0 right-0 bg-[#FF3E66] text-white px-2 py-1 rounded-bl-lg">
                  Featured
                </button>
              )}
            </div>
          ))}
        </div></Link>
      </section>

      {/* Latest Products */}
      <section className="w-4/5 mx-auto mt-16">
        <h3 className="text-center text-2xl font-bold mb-6">Latest Products</h3>
        <Link href ="/shop"><div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            { name: "Comfort Handy Craft", price: "$42.00", image: "1" },
            { name: "Comfort Handy Craft", price: "$42.00", image: "2" },
            { name: "Comfort Handy Craft", price: "$42.00", image: "3" },
            { name: "Comfort Handy Craft", price: "$42.00", image: "4" },
            { name: "Comfort Handy Craft", price: "$42.00", image: "5" },
            { name: "Comfort Handy Craft", price: "$42.00", image: "6" },
          ].map((product, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md flex flex-col items-center"
            >
              <Image
                src={`/chair-${product.image}.png`}
                alt={product.name}
                className="w-32 h-32 object-cover mb-4"
                height={200}
                width={200}
              />
              <h4 className="text-lg font-semibold text-center">
                {product.name}
              </h4>
              <p className="text-gray-500 text-center">{product.price}</p>
            </div>
          ))}

        </div></Link>
      </section>

      {/* Shapex Offer Section */}
      <section className="w-4/5 mx-auto mt-16 mb-10">
  <h3 className="text-center text-2xl font-bold mb-6">What Shapex Offer!</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
    {["24/7 Support", "Free Delivery", "Easy Returns", "24/7 Support"].map(
      (offer, index) => (
        <div key={index} className="p-6 border rounded-lg shadow-md">
          <h4 className="text-lg font-bold mb-2">{offer}</h4>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      )
    )}
  </div>
</section>

    </div>
    <div className="max-w-[1440px] mx-auto font-sans">
      {/* Hero Section */}
      <section className="bg-[#f4f4f9] py-10 px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-4">
              Vintage Product Of Comfort & Trending Products
            </h1>
            <p className="text-gray-700 mb-6">
              Explore our collection of modern, stylish furniture that blends
              aesthetics with function.
            </p>
            <Link href="/shop"><button className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition">
              Shop Now
            </button></Link>
          </div>
          <div className="flex-1">
            <Image
              src={sofa}
              alt="Hero Chair"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Trending Products
        </h2>
       <Link href="/shop"><div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { id: 11, name: "Modern Chair", price: "$120", discount: "20%" },
            { id: 12, name: "Stylish Sofa", price: "$200", discount: "30%" },
            { id: 13, name: "Classic Stool", price: "$80", discount: "15%" },
            { id: 10, name: "Elegant Bench", price: "$150", discount: "10%" },
          ].map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-200 rounded mb-4">
                <Image
                src={`/chair-${item.id}.png`}
                alt={item.name}
                className="w-32 h-32 object-cover mb-4 mx-20"
                width={200}
                height={200}
              />
              </div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600">{item.price}</p>
              <span className="text-pink-500 text-sm">{item.discount} OFF</span>
            </div>
          ))}
        </div></Link>
      </section>

      {/* Discount Items */}
      <section className="bg-gray-100 py-10 px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <Image
              src="/chair-18.png"
              alt="Discount Item"
              className="w-full max-w-xs mx-auto"
              width={200}
              height={200}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-semibold mb-4">
              20% Discount On All Products
            </h2>
            <p className="text-gray-700 mb-6">
              Limited time offer! Grab our best deals today.
            </p>
            <Link href="/shop">
            <button className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition">
              Shop Now
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-12 px-4">
  <h2 className="text-3xl font-semibold text-center mb-6">
    Top Categories
  </h2>
  <Link href="/shop"><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {[
      { id: 15, name: "chair" },
      { id: 16, name: "Table" },
      { id: 17, name: "Bench" },
      { id: 17, name: "mini chair" },
    ].map((category, idx) => (
      <div
        key={idx}
        className="p-4 border rounded-full shadow hover:shadow-full transition text-center"
      >
        <div className="h-24 bg-white rounded-full mb-2">
          <Image
            src={`/chair-${category.id}.png`}
            alt={category.name}
            className="mx-auto object-cover mb-4"
            width={90}
            height={50} 
          />
        </div>
        <h3 className="font-semibold">{category.name}</h3>
      </div>
    ))}
  </div></Link>
</section>


      {/* Newsletter */}
      <section className="bg-[#f4f4f9] py-10 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Get Latest Updates By Subscribe Our Newsletter
        </h2>
        <form className="flex justify-center mt-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full max-w-md px-4 py-2 border rounded-l focus:outline-none"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-r hover:bg-pink-600 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
<br></br>
      <div><Bottom1/></div>

      {/* Blog Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">Latest Blog</h2>
        <Link href="/blog"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
          { id: 1, name: "Top Essential Trends 2021"},
          { id: 2, name: "Top Essential Trends 2021"},
          { id: 1, name: "Top Essential Trends 2021"},
          ].map((title, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <div className=" bg-gray-200 rounded mb-4">
              <Image
                src={`/blog${title.id}.png`}
                alt={title.name}
                className="object-cover mb-4 "
                width={500}
                height={253}
                />
              </div>
              <h3 className="font-semibold">{title.name}</h3>
              <p className="text-gray-600 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                vel mauris quam.
              </p>
            </div>
          ))}
        </div></Link>
      </section>
    </div>
  </div>
  <div>
  <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/">1</PaginationLink>
      <PaginationLink href="/products">2</PaginationLink>
      <PaginationLink href="/blog">3</PaginationLink>
       <PaginationLink href="/contact">4</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/products" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
  </div>
    <Foot/>
    </div>

  );
}
 