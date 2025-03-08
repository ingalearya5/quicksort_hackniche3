'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, X, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl border border-gray-200">
      <div className="text-center mb-10">
        <ShoppingCart className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Your Shopping Cart</h1>
        <p className="text-lg text-gray-500 mt-2">Review and manage your items</p>
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl">Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0 flex items-center justify-center border-gray-300 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-base font-medium text-gray-700">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0 flex items-center justify-center border-gray-300 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 flex items-center justify-center hover:bg-red-50"
                onClick={() => removeFromCart(item.id)}
              >
                <X className="h-5 w-5 text-red-500 hover:text-red-600" />
              </Button>
            </div>
          ))}

          <Separator className="my-8 bg-gray-200" />

          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <p>Subtotal</p>
            <p>${cart.totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex gap-6 mt-8">
            <Button
              className="flex-1 bg-indigo-600 text-white py-4 text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              <CreditCard className="h-5 w-5" />
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-600 border-red-600 py-4 text-lg font-semibold hover:bg-red-50 transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={clearCart}
            >
              <Trash2 className="h-5 w-5" />
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;