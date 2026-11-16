import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { createOrder, User } from './database';
import { clearCart } from './CartManager';

type RouteProps = RouteProp<HomeStackParamList, 'Checkout'>;
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

const CheckoutScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cartItems, totalAmount } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('loggedInUser');
      if (data) {
        const u: User = JSON.parse(data);
        setUser(u);
      }
    };
    loadUser();
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Địa chỉ giao hàng và Số điện thoại!');
      return;
    }

    const userId = user ? user.id : 0;
    const username = user ? user.username : 'Khách vãng lai';

    const success = await createOrder(
      userId,
      username,
      address.trim(),
      phone.trim(),
      totalAmount,
      cartItems
    );

    if (success) {
      await clearCart();
      Alert.alert('🎉 Đặt hàng thành công!', 'Cảm ơn bạn đã mua sắm tại cửa hàng!', [
        {
          text: 'Xem đơn hàng',
          onPress: () => navigation.navigate('OrderHistory'),
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể đặt hàng, vui lòng thử lại!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>📋 Xác Nhận Đơn Hàng</Text>

      {/* Thông tin giao hàng */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
        <Text style={styles.label}>Tài khoản người đặt:</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user ? user.username : 'Khách hàng'}
          editable={false}
        />

        <Text style={styles.label}>Số điện thoại người nhận (*):</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại..."
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Địa chỉ giao hàng (*):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập địa chỉ nhận hàng chi tiết..."
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Tóm tắt đơn hàng có HIỂN THỊ HÌNH ẢNH SẢN PHẨM */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sản phẩm đã chọn ({cartItems.length})</Text>
        {cartItems.map((item, idx) => (
          <View key={idx} style={styles.checkoutItemRow}>
            <Image source={getImageSource(item.img)} style={styles.checkoutItemImg} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>{item.productName}</Text>
              <Text style={styles.itemQty}>Số lượng: x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')} đ</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handlePlaceOrder}>
        <Text style={styles.submitBtnText}>✅ ĐẶT HÀNG NGAY</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F8F9FA' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#6200EA', marginBottom: 12 },
  label: { fontSize: 13, color: '#616161', marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 10, marginBottom: 12, color: '#212121' },
  readOnlyInput: { backgroundColor: '#F1F3F5', color: '#757575' },
  textArea: { height: 70, textAlignVertical: 'top' },
  checkoutItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  checkoutItemImg: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#212121' },
  itemQty: { fontSize: 12, color: '#757575', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#E53935' },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#E53935' },
  submitBtn: { backgroundColor: '#6200EA', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CheckoutScreen;
