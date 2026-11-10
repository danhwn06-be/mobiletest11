import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { fetchOrdersByUser, Order, User } from './database';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const data = await AsyncStorage.getItem('loggedInUser');
    if (data) {
      const u: User = JSON.parse(data);
      const userOrders = await fetchOrdersByUser(u.id);
      setOrders(userOrders);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📜 Lịch Sử Đặt Hàng</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Mã đơn hàng: #{item.id}</Text>
              <Text style={styles.statusBadge}>{item.status}</Text>
            </View>

            <Text style={styles.dateText}>📅 Ngày đặt: {item.createdAt}</Text>
            <Text style={styles.addressText}>📍 Địa chỉ: {item.address} (SĐT: {item.phone})</Text>

            <View style={styles.divider} />

            <Text style={styles.itemsTitle}>Sản phẩm:</Text>
            {item.items?.map((subItem, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemName}>• {subItem.productName} (x{subItem.quantity})</Text>
                <Text style={styles.itemPrice}>{(subItem.price * subItem.quantity).toLocaleString('vi-VN')} đ</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalPrice}>{item.totalAmount.toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào!</Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', padding: 16, backgroundColor: '#FFFFFF', elevation: 2 },
  listContainer: { padding: 12 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#6200EA' },
  statusBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#757575', marginBottom: 2 },
  addressText: { fontSize: 13, color: '#424242', marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 8 },
  itemsTitle: { fontSize: 13, fontWeight: 'bold', color: '#616161', marginBottom: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  itemName: { fontSize: 13, color: '#212121' },
  itemPrice: { fontSize: 13, fontWeight: '600', color: '#212121' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#E53935' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#757575', marginBottom: 16 },
  shopBtn: { backgroundColor: '#6200EA', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  shopBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default OrderHistoryScreen;
