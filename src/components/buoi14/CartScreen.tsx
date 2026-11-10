import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { OrderItem } from './database';
import { getCart, updateCartQuantity, removeFromCart } from './CartManager';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const getImageSource = (img: string) => {
  if (img && (img.startsWith('file://') || img.startsWith('http'))) return { uri: img };
  switch (img) {
    case 'hinh1.jpg':
      return require('../../assets/book_images/hinh1.jpg');
    case 'hinh2.jpg':
      return require('../../assets/book_images/hinh2.jpg');
    case 'hinh3.jpg':
      return require('../../assets/book_images/hinh3.jpg');
    case 'hinh4.jpg':
      return require('../../assets/book_images/hinh4.jpg');
    default:
      return require('../../assets/book_images/hinh1.jpg');
  }
};

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const handleUpdateQuantity = async (productId: number, newQty: number) => {
    const updated = await updateCartQuantity(productId, newQty);
    setCartItems(updated);
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    Alert.alert('Xóa sản phẩm', `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const updated = await removeFromCart(productId);
          setCartItems(updated);
        },
      },
    ]);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
      return;
    }
    // Chuyển sang Stack HomeUser và kích hoạt màn hình Checkout kèm tham số
    navigation.navigate('HomeUser' as any, {
      screen: 'Checkout',
      params: { cartItems, totalAmount },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🛒 Giỏ Hàng Của Bạn</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <Image source={getImageSource(item.img)} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveItem(item.productId, item.productName)}
            >
              <Text style={styles.removeBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng đang trống!</Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('HomeUser' as any, { screen: 'Home' })}
            >
              <Text style={styles.shopNowText}>Khám phá sản phẩm</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.summaryFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')} đ</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleProceedCheckout}>
            <Text style={styles.checkoutBtnText}>⚡ Tiến hành Đặt hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  listContainer: { padding: 12 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  itemImg: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#E53935', marginVertical: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F5', borderRadius: 6, alignSelf: 'flex-start' },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold' },
  qtyVal: { paddingHorizontal: 12, fontWeight: 'bold' },
  removeBtn: { padding: 8 },
  removeBtnText: { fontSize: 18 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#757575', marginBottom: 16 },
  shopNowBtn: { backgroundColor: '#6200EA', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  shopNowText: { color: '#FFFFFF', fontWeight: 'bold' },
  summaryFooter: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 8,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#E53935' },
  checkoutBtn: { backgroundColor: '#6200EA', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;
