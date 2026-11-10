import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, OrderItem } from './database';

const CART_KEY = 'BUOI14_USER_CART';

export const getCart = async (): Promise<OrderItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    return [];
  }
};

export const addToCart = async (product: Product, quantity: number = 1): Promise<OrderItem[]> => {
  try {
    const cart = await getCart();
    const existingIndex = cart.findIndex((i) => i.productId === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        img: product.img,
      });
    }
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return [];
  }
};

export const updateCartQuantity = async (productId: number, quantity: number): Promise<OrderItem[]> => {
  try {
    let cart = await getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.productId !== productId);
    } else {
      const item = cart.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    }
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('❌ Error updating cart quantity:', error);
    return [];
  }
};

export const removeFromCart = async (productId: number): Promise<OrderItem[]> => {
  try {
    const cart = await getCart();
    const updated = cart.filter((i) => i.productId !== productId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    return [];
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
  }
};
