import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {

    if (user && user.user_id) {
      try {
        const response = await api.get(`/cart/${user.user_id}`);
        setCart(response.data?.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } else {
      setCart(null);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert('Please login to add to cart.');
    try {
      await api.post('/cart/add', { user_id: user.id, product_id: productId, quantity });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete(`/cart/clear/${user.user_id}`);
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
