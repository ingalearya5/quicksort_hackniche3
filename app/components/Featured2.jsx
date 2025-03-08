import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useUser } from "@clerk/nextjs";

const Featured2 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendationSource, setRecommendationSource] = useState("");

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    console.log(user?.id)

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Use the actual user ID from Clerk
        const response = await fetch(
          `http://localhost:5001/api/recommendations?userId=${user.id}&count=4`
        );

        // Check if response is successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch recommendations");
        }

        const data = await response.json();
        console.log("Received recommendations:", data);

        if (!data.products || data.products.length === 0) {
          setError("No recommendations available");
          setLoading(false);
          return;
        }

        setProducts(data.products);
        setRecommendationSource(data.source);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommendations:", error);

        // If user not found, try getting popular products as fallback
        if (error.message === "User not found in the dataset") {
          try {
            const fallbackResponse = await fetch(
              `http://localhost:5001/api/filtered?category=shirt&count=4`
            );

            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              if (fallbackData.products && fallbackData.products.length > 0) {
                setProducts(fallbackData.products);
                setRecommendationSource("fallback_popular");
                setLoading(false);
                return;
              }
            }
          } catch (fallbackError) {
            console.error("Fallback error:", fallbackError);
          }
        }

        setError(error.message);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.id, isLoaded]);

  // Add a debug function to manually check what's wrong
  const debugRecommendations = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/debug?userId=${user.id}`
      );
      const data = await response.json();
      console.log("Debug data:", data);
      alert("Check console for debug information");
    } catch (error) {
      console.error("Debug failed:", error);
    }
  };

  // Function to get section title based on recommendation source
  const getSectionTitle = () => {
    switch (recommendationSource) {
      case "user_history":
        return "Handpicked Just for You! ✨";
      case "popular_products":
        return "Trending Right Now! 🔥";
      case "fallback_popular":
        return "Popular Items You Might Like! 👀";
      default:
        return "Customers Like You Loved These! 🎯";
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Handpicked Just for You! ✨
          </h2>
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading recommendations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Customers Like You Loved These! 🎯
          </h2>
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-red-500 mb-4">
              {error === "User not found in the dataset"
                ? "We're building recommendations for you. Check back later!"
                : `Error: ${error}`}
            </p>
            <button
              onClick={debugRecommendations}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Recommendations
            </button>
          </div>
        </div>
      </section>
    );
  }

  // If no products are found, show alternative content
  if (products.length === 0) {
    return (
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Customers Like You Loved These! 🎯
          </h2>
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-gray-500 mb-4">
              No recommendations available yet. Please browse our catalog!
            </p>
            <button
              onClick={debugRecommendations}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Recommendations
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{getSectionTitle()}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured2;
