"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-purple-600 text-white">
      {/* 📧 Contact Info - Top Bar */}
      <div className="flex flex-wrap justify-between items-center px-4 py-2 text-xs sm:text-sm">
        <div className="flex items-center space-x-3">
          <span>📧 mhhasanul@gmail.com</span>
          <span>📞 (123) 456-7890</span>
          <Link href="/hdemo" className="hover:text-gray-200">
            Demo
          </Link>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <span>Currency: USD</span>
          <span>Pakistan</span>
          <Link href="/cart" className="hover:text-gray-200">
            Cart
          </Link>
          <Link href="/login" className="hover:text-gray-200">
            Login
          </Link>
          <button className="hover:text-gray-200">Wishlist</button>
        </div>
      </div>

      {/* 🟣 Main Navbar */}
      <div className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Hekto
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-sm text-gray-700 hover:text-purple-600">
              Home
            </Link>
            <Link href="/products" className="text-sm text-gray-700 hover:text-purple-600">
              Products
            </Link>
            <Link href="/blog" className="text-sm text-gray-700 hover:text-purple-600">
              Blog
            </Link>
            <Link href="/shop" className="text-sm text-gray-700 hover:text-purple-600">
              Shop
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-purple-600">
              Contact
            </Link>

            {/* Dropdown (Pages) */}
            <div className="relative group">
              <button className="text-sm text-gray-700 hover:text-purple-600">
                Pages
              </button>
              <div className="absolute left-0 hidden group-hover:block bg-white border mt-2 shadow-lg">
                <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  About Us
                </Link>
                <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  FAQ
                </Link>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-fuchsia-600 text-black"
            />
            <button
              type="submit"
              className="px-4 py-1 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        {isOpen && (
          <nav className="lg:hidden bg-white shadow-md p-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-purple-600">
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 hover:text-purple-600">
              Products
            </Link>
            <Link href="/blog" className="block text-gray-700 hover:text-purple-600">
              Blog
            </Link>
            <Link href="/shop" className="block text-gray-700 hover:text-purple-600">
              Shop
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-purple-600">
              Contact
            </Link>

            {/* Dropdown (Pages) */}
            <div>
              <button className="block text-gray-700 hover:text-purple-600">
                Pages
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <Link href="/about" className="block text-gray-700 hover:text-purple-600">
                  About Us
                </Link>
                <Link href="/faq" className="block text-gray-700 hover:text-purple-600">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Search Bar in Mobile Menu */}
            <form onSubmit={handleSearch} className="mt-3 flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-fuchsia-600 text-black"
              />
              <button
                type="submit"
                className="px-4 py-1 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600"
              >
                🔍
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
