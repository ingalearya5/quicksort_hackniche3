import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp,
  Package,
  Gift,
  Zap,
  ShoppingCart,
  Heart,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  ArrowRight,
  Check
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden">
          {/* Abstract background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full bg-blue-600"
                  style={{
                    width: `${Math.random() * 300 + 100}px`,
                    height: `${Math.random() * 300 + 100}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.1,
                    transform: `scale(${Math.random() * 0.8 + 0.2})`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2 self-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Collection Arrived
                </div>
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight">
                    Discover Your <span className="text-blue-600">Style</span>, Elevate Your <span className="text-blue-600">Wardrobe</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                    Shop the latest trends with personalized recommendations. Join our community of fashion enthusiasts today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button size="lg" className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl group">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors rounded-xl">
                    <span>Explore Collections</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs text-white border-2 border-white">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">2,500+</span> happy customers this week
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border border-blue-100 transform transition-transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5/6 h-5/6 relative flex items-center justify-center">
                    <div className="absolute w-64 h-64 bg-blue-600 rounded-full opacity-20 animate-pulse" />
                    <div className="w-48 h-48 bg-white rounded-xl shadow-xl p-8">
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                          </div>
                          <Heart className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-gray-200 rounded-full" />
                          <div className="h-6 w-32 bg-gray-300 rounded-full" />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="h-4 w-16 bg-gray-200 rounded-full" />
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-6 top-1/4 w-24 h-24 bg-yellow-300 rounded-full opacity-20" />
                <div className="absolute left-10 bottom-10 w-16 h-16 bg-blue-400 rounded-full opacity-20" />
                <div className="absolute right-1/4 bottom-1/3 w-32 h-32 bg-purple-400 rounded-full opacity-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Categories */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular Categories
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Shop By Category
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                Explore our curated collections across different fashion categories
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {[
                { name: "Casual", icon: <ShoppingBag /> },
                { name: "Formal", icon: <Package /> },
                { name: "Sports", icon: <Zap /> },
                { name: "Accessories", icon: <Gift /> },
                { name: "Winter", icon: <Shield /> },
                { name: "Summer", icon: <Star /> }
              ].map((category, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <div className="text-blue-600 group-hover:text-white transition-colors">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2">
                <Sparkles className="h-4 w-4 mr-2" />
                New Arrivals
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Featured Products
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                Discover our handpicked selection of trending items flying off the shelves
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Premium Cotton Tee", price: "$49.99", rating: 5, reviews: 42 },
                { name: "Designer Denim Jacket", price: "$129.00", rating: 4, reviews: 28 },
                { name: "Classic Fit Chinos", price: "$79.50", rating: 5, reviews: 36 },
                { name: "Signature Hoodie", price: "$89.00", rating: 4, reviews: 19 }
              ].map((product, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 p-8 flex items-center justify-center">
                    <ShoppingBag className="w-24 h-24 text-blue-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex items-center">
                        {Array(product.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        {Array(5 - product.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-gray-200"
                            />
                          ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-gray-900">{product.price}</span>
                      <Button size="sm" className="rounded-full border-blue-600 bg-blue-600 text-white hover:bg-blue-700 transition-colors group">
                        <ShoppingCart className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Button variant="outline" className="gap-1 group border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors rounded-full px-6">
                View All Products <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2">
                <Shield className="h-4 w-4 mr-2" />
                Our Promise
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Why Shop With Us
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                We're committed to providing the best shopping experience possible
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Truck />, 
                  title: "Free Express Shipping", 
                  description: "Free shipping on all orders over $50. Same-day dispatch on orders before 2pm."
                },
                { 
                  icon: <Shield />, 
                  title: "Secure Payments", 
                  description: "All transactions are secured with bank-level encryption and multiple payment options."
                },
                { 
                  icon: <Clock />, 
                  title: "24/7 Premium Support", 
                  description: "Our dedicated support team is available round-the-clock to assist you."
                },
                { 
                  icon: <ShoppingBag />, 
                  title: "Hassle-Free Returns", 
                  description: "30-day money-back guarantee with free return shipping on all items."
                }
              ].map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 rounded-xl border border-blue-100 p-6 bg-gradient-to-b from-white to-blue-50 hover:border-blue-300 transition-colors shadow-md hover:shadow-lg group">
                  <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors mb-2">
                    <div className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-16 bg-blue-50">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2">
                <Star className="h-4 w-4 mr-2 fill-blue-600" />
                Customer Love
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                What Our Customers Say
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                Don't just take our word for it — hear from our satisfied customers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah J.",
                  review: "The quality of clothes is amazing! Fast shipping and the customer service team went above and beyond to help me with sizing."
                },
                {
                  name: "Michael T.",
                  review: "I've been shopping here for over a year now and have never been disappointed. Their style selection is always on point and ahead of trends."
                },
                {
                  name: "Emily L.",
                  review: "The mobile app makes shopping so convenient. I can browse and order my favorite items in just a few taps. Highly recommend!"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                  <div className="flex flex-col h-full justify-between">
                    <div className="mb-4">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.review}"</p>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">Verified Customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Promo */}
        <section className="w-full py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 bg-opacity-30 text-white text-sm font-medium mb-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Mobile Shopping
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  Shop Anytime, Anywhere with Our App
                </h2>
                <p className="text-blue-100 md:text-lg max-w-[600px]">
                  Download our mobile app for a seamless shopping experience. 
                  Get exclusive app-only deals and personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    App Store
                  </Button>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Google Play
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-blue-300 mr-2" />
                      <span className="text-blue-100">{
                        ["Exclusive Deals", "Faster Checkout", "Order Tracking"][i]
                      }</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                <div className="w-64 h-[500px] bg-gradient-to-b from-blue-800 to-blue-900 rounded-[40px] p-3 shadow-2xl relative">
                  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-white rounded-[32px] overflow-hidden">
                    <div className="w-full h-16 bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                      StyleHub App
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="w-full h-40 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-24 bg-blue-50 rounded-lg flex items-center justify-center">
                            <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        Shop Now
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-blue-950 rounded-full opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full py-16 bg-white border-t border-blue-100">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
                <Mail className="h-4 w-4 mr-2" />
                Stay Connected
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-gray-600 md:text-lg mb-8 max-w-2xl mx-auto">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals. 
                Be the first to know about new arrivals and exclusive promotions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 min-w-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 py-2 text-gray-900 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                  />
                </div>
                <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-blue-100 py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">StyleHub</h3>
              <p className="text-sm text-gray-600">
                Redefining fashion experiences with curated collections and
                exceptional customer service since 2020.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            {[
              {
                title: "Shop",
                links: ["Men", "Women", "Accessories", "Sale", "New Arrivals"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Store Locations", "Our Blog", "Reviews"]
              },
              {
                title: "Support",
                links: ["Help Center", "Returns & Exchanges", "Shipping Info", "Order Tracking", "Contact Us"]
              }
            ].map((column, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center md:text-left text-sm text-gray-600">
              © {new Date().getFullYear()} StyleHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}