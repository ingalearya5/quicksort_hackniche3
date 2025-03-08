
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/homepage");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gray-100">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
                    Discover Your Style, Elevate Your Wardrobe
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                    Shop the latest trends with free shipping on orders over
                    $50. New collections added weekly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                    View Collections
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-lg transform transition-transform hover:scale-[1.02] duration-300 mt-6 lg:mt-0">
                <Image
                  src="/images/kala.jpeg"
                  alt="Featured collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Featured Products
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                Discover our handpicked selection of trending items that are
                flying off the shelves.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt={`Product ${item}`}
                      width={400}
                      height={400}
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">Product Name</h3>
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        (42)
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-gray-900">$99.00</span>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Button variant="outline" className="gap-1 group border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                View All Products <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Why Shop With Us
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                We're committed to providing the best shopping experience
                possible.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 p-6 bg-white hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
                <div className="p-3 rounded-full bg-blue-100 mb-2">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Free Shipping</h3>
                <p className="text-center text-sm text-gray-600">
                  On all orders over $50
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 p-6 bg-white hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
                <div className="p-3 rounded-full bg-blue-100 mb-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                <p className="text-center text-sm text-gray-600">
                  100% secure payment
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 p-6 bg-white hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
                <div className="p-3 rounded-full bg-blue-100 mb-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">24/7 Support</h3>
                <p className="text-center text-sm text-gray-600">
                  Dedicated support
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 p-6 bg-white hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
                <div className="p-3 rounded-full bg-blue-100 mb-2">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Easy Returns</h3>
                <p className="text-center text-sm text-gray-600">
                  30 day return policy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full py-12 md:py-20 border-t border-gray-200">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                  Stay Updated
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-900">
                  Subscribe to our newsletter
                </h2>
                <p className="text-gray-600 md:text-lg">
                  Get the latest updates on new products, sales, and style
                  guides straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                  />
                </div>
                <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-gray-200 py-6 md:py-8 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left text-sm text-gray-600">
            © {new Date().getFullYear()} StyleHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}