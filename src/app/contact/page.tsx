import React from "react";
import Foot from "../Components/component2";
import Header from "../Components/component1";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Heading from "../Components/component4";

export default function Home(){
    return(
  <div>
       <Header/>
     <Heading name="Contact"/>
     
           <div className="flex flex-col md:flex-row justify-around items-start p-8 bg-white space-y-8 md:space-y-0">
      {/* Left Section */}
      <div className="space-y-8 w-full md:w-1/2">
        {/* Information About Us */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Information About Us</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices tristique amet erat vitae
            eget dolor sit vitae lobortis quis bibendum quam.
          </p>
          <div className="flex space-x-3 mt-4">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Contact Way */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Way</h2>
          <div className="space-y-2 text-gray-600">
            <p>📞 Tel: 877-678-89-89</p>
            <p>✉️ E-Mail: shop@store.com</p>
            <p>📍 20 Margaret St, London Great Britain, 3NM-98-LK</p>
          </div>
          <div className="space-y-2 mt-4 text-gray-600">
            <p>🔗 Support Forum</p>
            <p>⏰ Open 24/7</p>
            <p>🚚 Free standard shipping on all orders</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get In Touch</h2>
        <p className="text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices tristique amet erat vitae eget
          dolor sit vitae lobortis quis bibendum quam.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Your E-mail"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Type Your Message"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <button
            type="submit"
            className="w-full py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 transition"
          >
            Send Mail
          </button>
        </form>
      </div>
    </div>
    <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/products" />
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
      <PaginationNext href="/faq" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

    <Foot/>
  </div>
  )
}