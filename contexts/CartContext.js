import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      // Use the same logic as in FoodItemCard to get the price
      const price = Number(item.price || item.Price || item.amount || 0);
      
      if (existing) {
        return prev.map(ci => 
          ci.id === item.id 
            ? { ...ci, quantity: ci.quantity + quantity, price } 
            : ci
        );
      }
      return [...prev, { ...item, price, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev => prev.map(ci => ci.id === id ? { ...ci, quantity } : ci));
  };

  const removeFromCart = id => {
    setCartItems(prev => prev.filter(ci => ci.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, ci) => {
    const price = Number(ci.price) || 0;
    return sum + (price * ci.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
