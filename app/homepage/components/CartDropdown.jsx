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
    <div className="flex items-center gap-4 p-4 rounded-lg shadow-sm bg-white border border-gray-100">
      <div className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-red-500 hover:bg-red-100" 
            onClick={() => removeFromCart(item.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">{item.category}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              -
            </Button>
            <span className="text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
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
            <Badge className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs">
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white rounded-xl shadow-xl">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-600" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto mt-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-3" />
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-3">
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
              <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            </div>

            <SheetFooter className="flex flex-col gap-3">
              <SheetClose asChild>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </SheetClose>
              <Button 
                variant="outline" 
                className="w-full border-red-500 text-red-500 hover:bg-red-100" 
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