import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [loyaltyDetails, setLoyaltyDetails] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      getLoyaltyDetails();
    }
  }, [user?.id]);

  const getLoyaltyDetails = async () => {
    try {
      const response = await axios.get(
        `/api/loyalty-details?userId=${user?.id}`
      );
      setLoyaltyDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(loyaltyDetails);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const router = useRouter();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const categories = [
    "Clothing",
    "Footwear",
    "Accessories",
    "Electronics",
    "Home & Living",
    "Beauty",
  ];

  // Mock user data - in a real app this would come from context/state
  const userData = {
    name: user?.fullName || "John Doe",
    avatar: user?.imageUrl || "/api/placeholder/40/40", // Using placeholder since actual images aren't available
    loyaltyLevel: loyaltyDetails?.tier,
    loyaltyPoints: loyaltyDetails?.totalPoints,
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with logo, search, and icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">ShopHub</span>
              </Link>
            </div>

            {/* Desktop category menu */}
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-medium"
                >
                  {category}
                </Link>
              ))}
              <div className="relative group">
                <button className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-medium flex items-center">
                  More
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  {categories.slice(4).map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Heart className="h-6 w-6" />
            </button>
            {/* User icon with dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="p-2 text-gray-500 hover:text-blue-600"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-6 w-6" />
              </button>

              {/* User menu dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={userData.avatar}
                          alt={userData.name}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">
                          {userData.name}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">
                            Loyalty Level:{" "}
                          </span>
                          <span className="ml-1 text-xs font-medium text-blue-600">
                            {userData?.loyaltyLevel}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">
                            Loyalty Points:{" "}
                          </span>
                          <span className="ml-1 text-xs font-medium text-blue-600">
                            {userData?.loyaltyPoints}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push(`/cartpage`)}
              className="p-2 text-gray-500 hover:text-blue-600 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search - only visible on mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu - only visible when menu is open */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-4 space-y-1 border-t border-gray-200">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
