"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import {
  ShoppingBag,
  X,
  ShoppingCart,
  Trash2,
  CreditCard,
  AlertCircle,
  Gift,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

const CartPage = () => {
  const { cart, clearCart, removeFromCart, updateQuantity, userId } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loyaltyDetails, setLoyaltyDetails] = useState(null);
  const [applyLoyaltyDiscount, setApplyLoyaltyDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      getLoyaltyDetails();
    }
  }, [user?.id]);

  useEffect(() => {
    calculateTotal();
  }, [cart.totalAmount, applyLoyaltyDiscount, loyaltyDetails]);

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

  const getLoyaltyDiscountPercentage = () => {
    if (!loyaltyDetails || loyaltyDetails.totalPoints < 100) return 0;

    switch (loyaltyDetails.tier) {
      case "Platinum":
        return 10;
      case "Gold":
        return 6;
      case "Silver":
        return 4;
      case "Standard":
        return 2;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    if (!applyLoyaltyDiscount || !loyaltyDetails || loyaltyDetails.totalPoints < 100) {
      setDiscountAmount(0);
      setFinalAmount(cart.totalAmount);
      return;
    }

    const discountPercentage = getLoyaltyDiscountPercentage();
    const discount = (cart.totalAmount * discountPercentage) / 100;
    setDiscountAmount(discount);
    setFinalAmount(cart.totalAmount - discount);
  };

  // This function collects basic browser/session data for analytics
  const getSessionData = () => {
    if (typeof window === "undefined") return {};

    return {
      deviceType: /Mobi|Android/i.test(navigator.userAgent)
        ? "mobile"
        : "desktop",
      browser: navigator.userAgent,
      referrer: document.referrer || "direct",
      timestamp: new Date().toISOString(),
    };
  };

  const handleCheckout = async () => {
    if (!userId) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Process checkout and record purchase data
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cart,
          finalAmount,
          discountApplied: applyLoyaltyDiscount ? getLoyaltyDiscountPercentage() : 0,
          sessionData: getSessionData(),
        }),
      });

      // Make sure we get valid JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid server response. Please try again.");
      }

      if (response.ok) {
        // Clear the cart after successful checkout
        clearCart();

        // Redirect to order confirmation page with the order ID
        toast.success("Order Successful");
        router.push(`/`);
      } else {
        console.error("Checkout failed:", data.message);
        setError(data.message || "Checkout failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error.message || "An error occurred during checkout. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const getLoyaltyStatusBadge = () => {
    if (!loyaltyDetails) return null;
    
    let badgeClass = "bg-gray-100 text-gray-600";
    
    if (loyaltyDetails.tier === "Platinum") {
      badgeClass = "bg-purple-100 text-purple-700";
    } else if (loyaltyDetails.tier === "Gold") {
      badgeClass = "bg-yellow-100 text-yellow-700";
    } else if (loyaltyDetails.tier === "Silver") {
      badgeClass = "bg-slate-200 text-slate-700";
    } else if (loyaltyDetails.tier === "Standard") {
      badgeClass = "bg-blue-100 text-blue-700";
    }
    
    return (
      <Badge variant="outline" className={badgeClass}>
        {loyaltyDetails.tier} Member
      </Badge>
    );
  };

  const isEligibleForDiscount = loyaltyDetails && loyaltyDetails.totalPoints >= 100;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Your Cart
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                {getLoyaltyStatusBadge()}
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                >
                  {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-4 px-2 py-2 text-sm font-medium text-gray-500 border-b border-gray-100 mb-2 hidden md:grid">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 items-center"
                    >
                      <div className="col-span-12 md:col-span-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 min-w-20 rounded-md overflow-hidden bg-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Skeleton className="h-full w-full" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-gray-800 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ₹{item.price} each
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex justify-center">
                        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-l-md hover:bg-gray-100 text-gray-600"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-r-md hover:bg-gray-100 text-gray-600"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 text-right">
                        <span className="md:hidden text-xs text-gray-500 mr-1">
                          Price:
                        </span>
                        <span className="text-sm font-medium">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="col-span-4 md:col-span-2 flex items-center justify-between md:justify-end gap-2">
                        <div className="text-right">
                          <span className="md:hidden text-xs text-gray-500 mr-1">
                            Total:
                          </span>
                          <span className="text-sm font-medium">
                            ₹{(item.price * item.quantity)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Loyalty Discount Section */}
                {loyaltyDetails && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-gray-800">Loyalty Rewards</h3>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Info className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              Standard: 2% discount<br />
                              Silver: 4% discount<br />
                              Gold: 6% discount<br />
                              Platinum: 10% discount
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">
                        You have <span className="font-medium">{loyaltyDetails.totalPoints} points</span>
                        {!isEligibleForDiscount && (
                          <span className="text-xs text-gray-500 ml-1">(Minimum 100 points required for discount)</span>
                        )}
                      </p>
                    </div>

                    {isEligibleForDiscount ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={applyLoyaltyDiscount}
                            onCheckedChange={setApplyLoyaltyDiscount}
                            id="loyalty-discount"
                          />
                          <label
                            htmlFor="loyalty-discount"
                            className="text-sm cursor-pointer"
                          >
                            Apply {getLoyaltyDiscountPercentage()}% {loyaltyDetails.tier} discount
                          </label>
                        </div>
                        
                        {applyLoyaltyDiscount && (
                          <span className="text-sm font-medium text-green-600">
                            -₹{discountAmount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <Switch disabled id="loyalty-discount" />
                        <label className="text-sm text-gray-500 cursor-not-allowed">
                          Not eligible for discount
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <p>Subtotal</p>
                    <p>₹{cart.totalAmount}</p>
                  </div>
                  
                  {applyLoyaltyDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <p>{getLoyaltyDiscountPercentage()}% {loyaltyDetails.tier} Discount</p>
                      <p>-₹{discountAmount}</p>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between text-lg font-semibold text-gray-800">
                    <p>Total</p>
                    <p>₹{finalAmount}</p>
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {cart.items.length > 0 && (
            <CardFooter className="flex flex-col md:flex-row gap-3 pt-6 border-t">
              <Button
                className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium flex items-center justify-center gap-2"
                onClick={handleCheckout}
                disabled={isProcessing || cart.items.length === 0}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto text-gray-600 border-gray-300 py-2.5 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={clearCart}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
};

export default CartPage;