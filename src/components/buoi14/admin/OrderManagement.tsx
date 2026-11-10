import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Order, fetchAllOrders, initDatabase, updateOrderStatus } from '../database';

const OrderManagement = ({ onBack }: { onBack?: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    initDatabase(() => loadData());
  }, []);

  const loadData = async () => {
    const data = await fetchAllOrders();
    setOrders(data);
  };

  const handleUpdateStatus = (orderId: number, currentStatus: string) => {
    Alert.alert(
      'Cập nhật trạng thái đơn hàng',
      `Chọn trạng thái mới cho Đơn hàng #${orderId}:`,
      [
        { text: '🚚 Đang giao hàng', onPress: () => changeStatus(orderId, 'Đang giao hàng') },
        { text: '✅ Đã hoàn thành', onPress: () => changeStatus(orderId, 'Đã hoàn thành') },
        { text: '❌ Hủy đơn hàng', onPress: () => changeStatus(orderId, 'Đã hủy') },
        { text: 'Quay lại', style: 'cancel' },
      ]
    );
  };

  const changeStatus = async (orderId: number, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      Alert.alert('Thành công 🎉', `Đã cập nhật trạng thái đơn hàng #${orderId} thành "${newStatus}"`);
      loadData();
    } else {
      Alert.alert('Lỗi', 'Cập nhật trạng thái thất bại!');
    }
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnBackText}>⬅️ Quay lại Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>📦 Quản Lý Đơn Hàng (Orders)</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Mã đơn hàng: #{item.id}</Text>
              <TouchableOpacity
                style={styles.statusBadgeBtn}
                onPress={() => handleUpdateStatus(item.id, item.status)}
              >
                <Text style={styles.statusBadge}>{item.status} ✏️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.userInfo}>👤 Người đặt: {item.username} (ID: {item.userId})</Text>
            <Text style={styles.detailText}>📞 SĐT: {item.phone}</Text>
            <Text style={styles.detailText}>📍 Địa chỉ: {item.address}</Text>
            <Text style={styles.dateText}>📅 Ngày đặt: {item.createdAt}</Text>

            <View style={styles.divider} />

            <Text style={styles.itemsTitle}>Danh sách món hàng:</Text>
            {item.items?.map((subItem, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemName}>• {subItem.productName} (x{subItem.quantity})</Text>
                <Text style={styles.itemPrice}>{(subItem.price * subItem.quantity).toLocaleString('vi-VN')} đ</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <Text style={styles.totalLabel}>Tổng tiền:</Text>
              <Text style={styles.totalPrice}>{item.totalAmount.toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Chưa có đơn hàng nào trong hệ thống!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
  btnBack: { backgroundColor: '#6C757D', padding: 8, borderRadius: 6, marginBottom: 12, alignSelf: 'flex-start' },
  btnBackText: { color: '#FFFFFF', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#6200EA' },
  statusBadgeBtn: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadge: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  userInfo: { fontSize: 14, fontWeight: 'bold', color: '#212121', marginBottom: 2 },
  detailText: { fontSize: 13, color: '#616161', marginBottom: 2 },
  dateText: { fontSize: 12, color: '#9E9E9E', marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 8 },
  itemsTitle: { fontSize: 13, fontWeight: 'bold', color: '#424242', marginBottom: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  itemName: { fontSize: 13, color: '#212121' },
  itemPrice: { fontSize: 13, fontWeight: '600', color: '#212121' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#E53935' },
  emptyView: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#757575', fontSize: 15 },
});

export default OrderManagement;
