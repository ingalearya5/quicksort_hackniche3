"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/app/components/ProductCard";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Expanded filters
  const [filters, setFilters] = useState({
    category: "all",
    gender: "all",
    rating: 0,
    priceRange: [0, 10000], // Default price range
  });

  const [sortOption, setSortOption] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 10000]); // For the slider UI
  const [maxPrice, setMaxPrice] = useState(10000);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);

        // Find the maximum price to set the slider range
        if (data.products.length > 0) {
          const highestPrice = Math.max(
            ...data.products.map((p) => {
              const price =
                typeof p.price === "string"
                  ? parseFloat(p.price.replace(/[^0-9.]/g, ""))
                  : parseFloat(p.price);
              return price;
            })
          );
          setMaxPrice(Math.ceil(highestPrice / 1000) * 1000); // Round up to nearest thousand
          setPriceRange([0, highestPrice]);
          setFilters((prev) => ({ ...prev, priceRange: [0, highestPrice] }));
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Gender filter
    if (filters.gender !== "all") {
      result = result.filter(
        (product) =>
          product.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => product.rating >= filters.rating);
    }

    // Price range filter
    result = result.filter((product) => {
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
          : parseFloat(product.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sorting
    if (sortOption !== "relevance") {
      result = sortProducts(result, sortOption);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page after filter changes
  }, [searchTerm, filters, sortOption, products]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const sortProducts = (productsToSort, option) => {
    const sortedProducts = [...productsToSort];

    switch (option) {
      case "price-asc":
        return sortedProducts.sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^0-9.]/g, "")) -
            parseFloat(b.price.replace(/[^0-9.]/g, ""))
        );

      case "price-desc":
        return sortedProducts.sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^0-9.]/g, "")) -
            parseFloat(a.price.replace(/[^0-9.]/g, ""))
        );

      case "rating-desc":
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case "newest":
        return sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      default:
        return sortedProducts;
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
    setFilters((prev) => ({ ...prev, priceRange: values }));
  };

  const handleGenderChange = (gender) => {
    setFilters((prev) => ({ ...prev, gender }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      gender: "all",
      rating: 0,
      priceRange: [0, maxPrice],
    });
    setPriceRange([0, maxPrice]);
    setSortOption("relevance");
  };

  const getPageTitle = () => {
    if (filters.category !== "all") {
      return (
        filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      );
    }

    if (filters.gender !== "all") {
      return `${
        filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)
      }'s Collection`;
    }

    return "All Products";
  };

  const handleNavbarSearch = () => {
    // Implementation for navbar search
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={handleNavbarSearch} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>

            {!loading && (
              <p className="text-sm text-gray-500 mt-2 md:mt-0">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64 md:flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow sticky top-24">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    min={0}
                    max={maxPrice}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Gender</h3>
                <div className="space-y-2">
                  {["all", "male", "female", "unisex"].map((gender) => (
                    <div key={gender} className="flex items-center">
                      <input
                        type="radio"
                        id={`gender-${gender}`}
                        name="gender"
                        checked={filters.gender === gender}
                        onChange={() => handleGenderChange(gender)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`gender-${gender}`}
                        className="ml-2 text-sm"
                      >
                        {gender === "all" ? "All" : gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Rating</h3>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="ml-2 text-sm"
                      >
                        {rating === 0 ? (
                          "Any rating"
                        ) : (
                          <>
                            {[...Array(rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                ★
                              </span>
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                              <span key={i} className="text-gray-300">
                                ★
                              </span>
                            ))}
                            & up
                          </>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { id: "relevance", label: "Relevance" },
                    { id: "price-asc", label: "Price: Low to High" },
                    { id: "price-desc", label: "Price: High to Low" },
                    { id: "rating-desc", label: "Highest Rated" },
                    { id: "newest", label: "Newest First" },
                  ].map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`sort-${option.id}`}
                        name="sort"
                        checked={sortOption === option.id}
                        onChange={() => handleSortChange(option.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`sort-${option.id}`}
                        className="ml-2 text-sm"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid and Pagination */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-lg text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-lg text-red-600">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-600">
                  No products match the selected filters.
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({
                        length: Math.ceil(
                          filteredProducts.length / productsPerPage
                        ),
                      }).map((_, index) => {
                        // Show limited page numbers with ellipsis for better UI
                        const pageNum = index + 1;
                        const isCurrentPage = pageNum === currentPage;

                        // Always show first, last, current, and 1 on each side of current page
                        if (
                          pageNum === 1 ||
                          pageNum ===
                            Math.ceil(
                              filteredProducts.length / productsPerPage
                            ) ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              className={`w-10 h-10 ${
                                isCurrentPage ? "bg-blue-600 text-white" : ""
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }

                        // Show ellipsis for breaks
                        if (
                          (pageNum === 2 && currentPage > 3) ||
                          (pageNum ===
                            Math.ceil(
                              filteredProducts.length / productsPerPage
                            ) -
                              1 &&
                            currentPage <
                              Math.ceil(
                                filteredProducts.length / productsPerPage
                              ) -
                                2)
                        ) {
                          return (
                            <span
                              key={`ellipsis-${pageNum}`}
                              className="inline-flex items-center justify-center w-10 h-10"
                            >
                              ...
                            </span>
                          );
                        }

                        return null;
                      })}
                    </div>

                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredProducts.length / productsPerPage)
                      }
                      variant="outline"
                      size="sm"
                      className="ml-2"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
