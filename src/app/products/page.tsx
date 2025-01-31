// components/ProductGrid.tsx
import Link from 'next/link';
import Header from '../Components/component1';
import Foot from '../Components/component2';
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from '@sanity/image-url';
import Bottom1 from '../Components/component3';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

async function getData() {
  const query = `*[_type == "Products"]{
    _id,
    ProductCategory,
    ProductCategoryImage
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProductGrid() {
  const data = await getData();

  return (
    <div>
      <Header />
      <div className="bg-gray-50">
        <section className="bg-purple-100 text-center py-10">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="mt-2 text-gray-600">Browse our product categories</p>
        </section>
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Ecommerce Items</h1>
        <div className="text-center text-gray-500 mb-6">
          {data.length} Product Categories
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((val: any) => (
            <Link
              key={val._id}
              href="/shop"
              passHref
            >
              <div className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gray-100 aspect-w-1 aspect-h-1 w-full">
                  <Image
                    src={urlFor(val.ProductCategoryImage).url()}
                    alt={val.ProductCategory}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    width={250}
                    height={183}
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {val.ProductCategory}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
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
      <PaginationNext href="/blog" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
      <Bottom1/>
      <Foot />
    </div>
  );
}
