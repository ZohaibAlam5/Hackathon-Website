import Header from "../Components/component1";
import Foot from "../Components/component2";
import Bottom1 from "../Components/component3";
import Image from "next/image";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  

import blogimg1 from "../images/blog1.jpg"
import blogimg2 from "../images/blog2.jpg"
import blogimg3 from "../images/blog3.jpg"
import Heading from "../Components/component4";



export default function Home(){
    return(
        <div>
            <Header/>
            <div>
            <Heading name="Blog"/>
          <div>
            <div className="container py-10 2xl:px-20 xl:px-10 lg:px-10 sm:px-8 " >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Blog Post 1 */}
          <div className="mb-10">
            <Image
              src={blogimg1}
              alt="Post 1"
              className="w-full rounded-md"
            />
            <div className="mt-4">
              <p className="text-pink-500 font-medium text-sm">Self Feature</p>
              <p className="text-gray-400 text-sm">Aug 28, 2023</p>
              <h2 className="text-2xl font-bold mt-2 mb-4">
                Mauris at orci non vulputate diam tincidunt nec.
              </h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit
                facilisis quis auctor pretium ipsum, cursus...
              </p>
              <a
                href="#"
                className="text-blue-500 font-medium hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
          {/* Blog Post 2 */}
          <div className="mb-10">
            <Image
              src={blogimg2}
              alt="Post 2"
              className="w-full rounded-md"
            />
            <div className="mt-4">
              <p className="text-pink-500 font-medium text-sm">Self Feature</p>
              <p className="text-gray-400 text-sm">Aug 28, 2023</p>
              <h2 className="text-2xl font-bold mt-2 mb-4">
                Aenean vitae in aliquam ultrices lectus. Etiam.
              </h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit
                facilisis quis auctor pretium ipsum, cursus...
              </p>
              <a
                href="#"
                className="text-blue-500 font-medium hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
          {/* Blog Post 3 */}
          <div className="mb-10">
            <Image 
              src={blogimg3}
              alt="Post 3"
              className="w-full rounded-md"
            />
            <div className="mt-4">
              <p className="text-pink-500 font-medium text-sm">Self Feature</p>
              <p className="text-gray-400 text-sm">Aug 28, 2023</p>
              <h2 className="text-2xl font-bold mt-2 mb-4">
                Sit nam congue feugiat nisl, mauris amet nisi.
              </h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit
                facilisis quis auctor pretium ipsum, cursus...
              </p>
              <a
                href="#"
                className="text-blue-500 font-medium hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="">
          {/* Search */}
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Categories */}
          <div className="mb-10">
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Women (10)
              </li>
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Men (8)
              </li>
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Nature (15)
              </li>
            </ul>
          </div>
          {/* Recent Posts */}
          <div className="mb-10">
            <h3 className="font-bold mb-4">Recent Posts</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Post Title 1
              </li>
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Post Title 2
              </li>
              <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                Post Title 3
              </li>
            </ul>
          </div>
          {/* Sale Product */}
          <div className="mb-10">
            <h3 className="font-bold mb-4">Sale Product</h3>
            <p className="text-gray-600">Details about sale products go here.</p>
          </div>
          {/* Offer Product */}
          <div className="mb-10">
            <h3 className="font-bold mb-4">Offer Product</h3>
            <p className="text-gray-600">Details about offered products go here.</p>
          </div>
          {/* Tags */}
          <div className="">
            <h3 className="font-bold mb-4">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-200 px-2 py-1 rounded-md">General</span>
              <span className="bg-gray-200 px-2 py-1 rounded-md">Women</span>
              <span className="bg-gray-200 px-2 py-1 rounded-md">Men</span>
            </div>
          </div>
        </div>
      </div>
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
      <PaginationNext href="contact" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
           </div>
          <Bottom1/>
           <Foot/>
        </div>
        
    )
}