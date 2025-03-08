import { insertInteractions } from "@/lib/utils";
import axios from "axios";
import { Heart, ShoppingCart, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Import shadcn UI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [productData, setProductData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart(); // Use the cart context

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getProductDetail?id=${product.id}`
      );
      const obj = {
        image: response.data?.image,
        title: response.data?.title,
        price: response.data?.price,
        rating: response.data?.rating,
        id: response.data?._id,
        gender: response.data?.gender,
        category: response.data?.category,
        reviews: response?.data?.reviews,
        description: response?.data?.description,
      };
      setProductData(obj);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      addToCart({
        id: product._id?.toString() || product.id,
        name: productData?.title || productData?.name,
        price: productData?.price,
        image: productData?.image,
        quantity: 1,
      });
      await insertInteractions({
        userId: user.id,
        action: "add_to_cart",
        productId: product.id,
        searchQuery: null,
        filtersUsed: null,
      });
      toast.success("Added to cart");
      if (modalOpen) setModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error adding to cart");
    }
  };

  const handleViewDetails = async () => {
    try {
      await insertInteractions({
        userId: user.id,
        action: "view_product",
        productId: product.id,
        searchQuery: null,
        filtersUsed: null,
      });
      setModalOpen(true);
    } catch (error) {
      toast.error("Error viewing product");
    }
  };

  const handleNavigateToProduct = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <>
      <div className="group">
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative mb-3">
          <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition">
            <Heart className="w-4 h-4" />
          </div>
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
          <div className="flex items-center justify-center h-full">
            <img
              src={productData?.image}
              alt={productData?.title}
              className=""
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-black/5 backdrop-blur-sm py-2 px-3 translate-y-full group-hover:translate-y-0 transition">
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 flex items-center justify-center gap-1 bg-white text-sm font-medium py-1.5 rounded hover:bg-gray-100 transition"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
              </button>
              <button
                onClick={() => handleViewDetails()}
                className="flex-1 flex items-center justify-center gap-1 bg-white text-sm font-medium py-1.5 rounded hover:bg-gray-100 transition"
              >
                <Eye className="w-4 h-4" /> Details
              </button>
            </div>
          </div>
        </div>
        <h3 className="font-medium text-sm mb-1 truncate">
          {productData?.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm">₹{productData?.price}</span>
          {productData?.originalPrice && (
            <span className="text-gray-500 text-xs line-through">
              ₹{productData?.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 ${
                  i < productData?.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improved Product Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden rounded-lg">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 bg-white/90 hover:bg-white rounded-full z-10 shadow-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row max-h-[85vh]">
            {/* Product Image - Left Side */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 min-h-[320px]">
              <img
                src={productData?.image}
                alt={productData?.title}
                className="max-h-[400px] max-w-full object-contain"
              />
            </div>

            {/* Product Details - Right Side */}
            <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {productData?.title}
                </h2>

                {/* Category & Gender Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {productData?.category && (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {productData.category}
                    </Badge>
                  )}
                  {productData?.gender && (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {productData.gender}
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${
                          i < productData?.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {productData?.reviews?.length || 0} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{productData?.price}
                  </span>
                  {productData?.originalPrice && (
                    <span className="text-gray-500 text-base line-through ml-3">
                      ₹{productData?.originalPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                {productData?.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600">
                      {productData.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gray-900 hover:bg-black text-white py-6"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleNavigateToProduct()}
                    variant="outline"
                    className="w-full border-gray-200 py-6"
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
