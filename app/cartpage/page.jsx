"use client";

import React from "react";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, Minus, Plus, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const CartPage = () => {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Calculate total with proper number handling
  const calculateItemTotal = (price, quantity) => {
    // Remove currency symbol if present and convert to number
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^\d.-]/g, ""))
        : parseFloat(price);

    return isNaN(numericPrice) ? 0 : numericPrice * quantity;
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + calculateItemTotal(item.price, item.quantity);
    }, 0);
  };

  const cartTotal = calculateCartTotal();

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Shopping Cart
        </h1>

        {!cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                // Handle price display properly
                const displayPrice =
                  typeof item.price === "string" && item.price.includes("₹")
                    ? item.price
                    : `₹${item.price}`;

                // Calculate item total
                const itemTotal = calculateItemTotal(item.price, item.quantity);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center"
                  >
                    <div className="flex-shrink-0 w-20 h-20 mr-4">
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-800 mb-1">
                        {item.title || item.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {displayPrice}
                      </p>
                    </div>

                    <div className="flex flex-col items-end mr-4">
                      <p className="text-gray-800 font-medium mb-2">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                >
                  <CreditCard size={18} />
                  Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-gray-600 hover:bg-gray-50"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
