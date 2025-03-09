'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Define initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

// Create context
const CartContext = createContext(initialState);

// Cart reducer to handle various actions
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + Number(action.payload.price)
        };
      } else {
        // Add new item with quantity 1
        const newItem = { ...action.payload, quantity: 1 };
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + Number(action.payload.price)
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload
      );

      if (existingItemIndex === -1) return state;

      const item = state.items[existingItemIndex];
      const itemPrice = Number(item.price);

      if (item.quantity === 1) {
        // Remove item completely if quantity is 1
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          totalItems: state.totalItems - 1,
          totalAmount: state.totalAmount - itemPrice
        };
      } else {
        // Decrease quantity by 1
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity - 1
        };

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems - 1,
          totalAmount: state.totalAmount - itemPrice
        };
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const quantityDiff = quantity - item.quantity;
      const priceDiff = Number(item.price) * quantityDiff;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = { ...item, quantity };
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + priceDiff
      };
    }

    case 'LOAD_CART':
      return action.payload;

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  // Generate or retrieve anonymous user ID on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('anonymousUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a simple UUID for anonymous users
      const newUserId = 'anon_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymousUserId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Load cart data on initial render and userId changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      if (userId) {
        // Try to load cart from database first
        try {
          const response = await fetch(`/api/cart?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            dispatch({ type: 'LOAD_CART', payload: data });
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch cart from server:', error);
          // Fall back to local storage if server fetch fails
        }
      }
      
      // If server fetch failed, try local storage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          localStorage.removeItem('cart');
        }
      }
      
      setIsLoading(false);
    };
    
    if (userId) {
      loadCart();
    }
  }, [userId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state, isLoading]);

  // Sync cart to database when it changes and user id is available
  useEffect(() => {
    const syncCartToDatabase = async () => {
      if (userId && !isLoading) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              ...state
            }),
          });
        } catch (error) {
          console.error('Failed to sync cart to database:', error);
        }
      }
    };
    
    syncCartToDatabase();
  }, [state, userId, isLoading]);

  // Create value object
  const value = {
    cart: state,
    userId,
    isLoading,
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    removeFromCart: (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId }),
    updateQuantity: (productId, quantity) => 
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};