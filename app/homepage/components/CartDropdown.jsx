'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { ShoppingCart, X, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex py-4">
      {/* Product image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => removeFromCart(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="mt-1 text-xs text-gray-500">{item.category}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              className="border rounded-md px-2 text-gray-600"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              -
            </button>
            <span className="mx-2 text-gray-900 font-medium">{item.quantity}</span>
            <button
              className="border rounded-md px-2 text-gray-600"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const CartDropdown = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto mt-4">
          {cart.items.length === 0 ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        
        {cart.items.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="space-y-3 py-3">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${cart.totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </div>
            </div>
            
            <SheetFooter className="flex-col gap-3 sm:flex-col">
              <SheetClose asChild>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </SheetClose>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDropdown;