"use client";
import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingCart,
  Search,
  User,
  Heart,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Featured1 from "./components/Featured1";
import Featured2 from "./components/Featured2";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
     

      <Navbar />

      <div className="max-w-[80%] mx-auto">
        {/* Category Circles */}
        {/* <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition mb-2">
                    {category.icon}
                  </div>
                  <span className="text-xs text-center">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Banner Slider */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-lg">
              <div className="flex items-center justify-between bg-gradient-to-r from-black to-gray-800 text-white p-8 md:p-12">
                <div className="max-w-lg">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    BIG CART
                  </h2>
                  <p className="text-xl md:text-2xl font-light mb-6">
                    Save more with every extra item!
                  </p>
                  <p className="text-lg font-medium mb-4">Up to 70% Off</p>
                  <button
                    onClick={() => router.push(`/products`)}
                    className="bg-white text-black py-2 px-6 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    View All Products
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="w-64 h-64 bg-gray-700 rounded-full flex items-center justify-center opacity-30">
                    <ShoppingCart className="w-32 h-32" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? "bg-white" : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <div
                  key={collection.title}
                  className="relative group overflow-hidden rounded-lg"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="text-6xl text-gray-300">
                      {collection.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-3">
                      {collection.description}
                    </p>
                    <div className="flex items-center text-white text-sm font-medium">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <Featured1 products={products}/>

        <Featured2 products={products}/>

        {/* Deals & Promotions */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Steal the Deal</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Limited time offers on top brands
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold">85%</span>
                  <span className="text-lg font-medium ml-1">OFF</span>
                </div>
                <button className="bg-black text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-800 transition">
                  Shop Now
                </button>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Be the first to grab the latest styles
                </p>
                <div className="mb-4">
                  <span className="text-lg font-medium">Starting at </span>
                  <span className="text-2xl font-bold">₹499</span>
                </div>
                <button className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 pt-10 pb-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4">Shop</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Women
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Men
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Kids
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Home & Living
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Beauty
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Customer Service</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Shipping
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Size Guide
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">About</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Corporate Responsibility
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Investors
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Stay Connected</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Subscribe to get special offers, free giveaways, and new
                  arrivals.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-white border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-blue-700 transition">
                    Join
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © 2025 StyleHub. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Data
const categories = [
  { name: "MY FEED", href: "/feed", icon: "🏠" },
  { name: "KURTAS", href: "/kurtas", icon: "👚" },
  { name: "TOPS", href: "/tops", icon: "👕" },
  { name: "DRESSES", href: "/dresses", icon: "👗" },
  { name: "SAREES", href: "/sarees", icon: "🧣" },
  { name: "SUITS", href: "/suits", icon: "👔" },
  { name: "ETHNIC SETS", href: "/ethnic-sets", icon: "👘" },
  { name: "BOTTOMS", href: "/bottoms", icon: "👖" },
  { name: "BAGS", href: "/bags", icon: "👜" },
  { name: "FOOTWEAR", href: "/footwear", icon: "👠" },
  { name: "ADD ONS", href: "/add-ons", icon: "✨" },
  { name: "WINTER", href: "/winter", icon: "🧣" },
];

const collections = [
  {
    title: "Raw & Edgy",
    description: "Ripped, rugged, ready to rock",
    href: "/collection/raw-edgy",
    icon: "👖",
  },
  {
    title: "Vacation Vibes",
    description: "Perfect beachside getaway looks",
    href: "/collection/vacation-vibes",
    icon: "🏖️",
  },
  {
    title: "Elegant Sarees",
    description: "Traditional with a modern twist",
    href: "/collection/elegant-sarees",
    icon: "👘",
  },
  {
    title: "Office Chic",
    description: "Professional and stylish workwear",
    href: "/collection/office-chic",
    icon: "💼",
  },
];

const products = [
  {
    id: 1,
    name: "Slim Fit Cotton Shirt",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4,
    reviews: 128,
  },
  {
    id: 2,
    name: "Floral Print Maxi Dress",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    rating: 5,
    reviews: 86,
  },
  {
    id: 3,
    name: "Classic Denim Jeans",
    price: 1599,
    originalPrice: null,
    discount: null,
    rating: 4,
    reviews: 210,
  },
  {
    id: 4,
    name: "Embroidered Kurta Set",
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    rating: 4,
    reviews: 64,
  },
];


// <Header
// onSearch={handleSearch}
// onCategorySelect={handleCategorySelect}
// onFilterChange={handleFilterChange}
// onSortChange={handleSortChange}
// />
