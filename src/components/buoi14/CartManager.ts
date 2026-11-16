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

export const addToCart = async (
  product: Product,
  quantityToAdd: number = 1
): Promise<{ success: boolean; cart: OrderItem[]; message?: string }> => {
  try {
    const cart = await getCart();
    const existingIndex = cart.findIndex((i) => i.productId === product.id);
    const existingQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    const newTotalQty = existingQty + quantityToAdd;

    const maxStock = product.stock !== undefined && product.stock !== null ? product.stock : 999;

    if (maxStock <= 0) {
      return { success: false, cart, message: `Sản phẩm "${product.name}" hiện đã HẾT HÀNG trong kho!` };
    }

    if (newTotalQty > maxStock) {
      return {
        success: false,
        cart,
        message: `Kho hiện chỉ còn ${maxStock} sản phẩm. Bạn đã có ${existingQty} sản phẩm trong giỏ!`,
      };
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity = newTotalQty;
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantityToAdd,
        img: product.img,
      });
    }
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return { success: true, cart };
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return { success: false, cart: [], message: 'Đã xảy ra lỗi khi thêm vào giỏ hàng!' };
  }
};

export const updateCartQuantity = async (
  productId: number,
  quantity: number,
  maxStock?: number
): Promise<{ success: boolean; cart: OrderItem[]; message?: string }> => {
  try {
    let cart = await getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.productId !== productId);
    } else {
      if (maxStock !== undefined && quantity > maxStock) {
        return {
          success: false,
          cart,
          message: `Số lượng vượt quá tồn kho hiện tại (${maxStock} sản phẩm)!`,
        };
      }
      const item = cart.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    }
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return { success: true, cart };
  } catch (error) {
    console.error('❌ Error updating cart quantity:', error);
    return { success: false, cart: [], message: 'Đã xảy ra lỗi khi cập nhật giỏ hàng!' };
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
