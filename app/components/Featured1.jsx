import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useUser } from "@clerk/nextjs";

const Featured1 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.id) return; 

    const fetchRecommendations = async () => {
      setLoading(true);

      const userId = "user_2";

      try {
        const response = await fetch(
          `http://localhost:5000/api/recommendations?userId=${userId}&count=4`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch recommendations");
        }

        const data = await response.json();
        console.log("Received recommendations:", data);

        if (!data.products || data.products.length === 0) {
          setError("No recommendations available");
          setProducts([]);
        } else {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.id, isLoaded]); // Dependency updated

  const debugRecommendations = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/debug?userId=${user?.id}`
      );
      const data = await response.json();
      console.log("Debug data:", data);
      alert("Check console for debug information");
    } catch (error) {
      console.error("Debug failed:", error);
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
            Customers Like You Loved These! 🎯
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
        <h2 className="text-2xl font-bold mb-6">
          Customers Like You Loved These! 🎯
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured1;
