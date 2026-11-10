import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';
import ProductManagement from './ProductManagement';

import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const navigation = useNavigation<any>();
  const [screen, setScreen] = useState<'home' | 'users' | 'categories' | 'products' | 'orders'>('home');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Bảo vệ route: Chỉ cho phép người dùng có role admin truy cập
  useEffect(() => {
    const checkAdminPermission = async () => {
      try {
        const data = await AsyncStorage.getItem('loggedInUser');
        if (!data) {
          Alert.alert('Từ chối truy cập', 'Vui lòng đăng nhập với tài khoản Admin để truy cập!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('MainTabs');
              },
            },
          ]);
          setIsAdmin(false);
          return;
        }
        const user = JSON.parse(data);
        if (user.role !== 'admin') {
          Alert.alert('Từ chối truy cập', 'Bạn không có quyền quản trị viên!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('MainTabs');
              },
            },
          ]);
          setIsAdmin(false);
          return;
        }
        setIsAdmin(true);
      } catch {
        navigation.navigate('MainTabs');
      }
    };
    checkAdminPermission();
  }, [navigation]);

  const handleBackToStore = () => {
    navigation.navigate('MainTabs');
  };

  if (isAdmin === false) {
    return null;
  }

  if (screen === 'users') return <UserManagement onBack={() => setScreen('home')} />;
  if (screen === 'categories') return <CategoryManagement onBack={() => setScreen('home')} />;
  if (screen === 'products') return <ProductManagement onBack={() => setScreen('home')} />;
  if (screen === 'orders') return <OrderManagement onBack={() => setScreen('home')} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>⚙️ TRANG CHỦ QUẢN TRỊ ADMIN</Text>
      <Text style={styles.subTitle}>Hệ thống quản lý bán hàng thương mại điện tử</Text>

      <View style={styles.gridContainer}>
        {/* Nút 1: Quản lý User */}
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#4CAF50' }]}
          onPress={() => setScreen('users')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardTitle}>Quản Lý User</Text>
          <Text style={styles.cardDesc}>Xem, phân quyền admin/user, xóa tài khoản</Text>
        </TouchableOpacity>

        {/* Nút 2: Quản lý Danh mục */}
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#2196F3' }]}
          onPress={() => setScreen('categories')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>🏷️</Text>
          <Text style={styles.cardTitle}>Quản Lý Loại Sản Phẩm</Text>
          <Text style={styles.cardDesc}>Thêm, sửa, xóa loại & thêm sản phẩm trực tiếp</Text>
        </TouchableOpacity>

        {/* Nút 3: Quản lý Sản phẩm */}
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#FF9800' }]}
          onPress={() => setScreen('products')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>Quản Lý Sản Phẩm</Text>
          <Text style={styles.cardDesc}>Thêm sản phẩm mới, cập nhật giá, hình ảnh</Text>
        </TouchableOpacity>

        {/* Nút 4: Quản lý Đơn hàng */}
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#9C27B0' }]}
          onPress={() => setScreen('orders')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>🚚</Text>
          <Text style={styles.cardTitle}>Quản Lý Đơn Hàng (Orders)</Text>
          <Text style={styles.cardDesc}>Xem danh sách & Cập nhật tình trạng đơn hàng</Text>
        </TouchableOpacity>

        {/* Nút Quay lại Giao diện người dùng */}
        <TouchableOpacity
          style={styles.backToUserBtn}
          onPress={handleBackToStore}
          activeOpacity={0.8}
        >
          <Text style={styles.backToUserText}>🛍️ Quay lại Cửa Hàng Mua Sắm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 20,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#212121', textAlign: 'center', marginBottom: 4 },
  subTitle: { fontSize: 13, color: '#757575', textAlign: 'center', marginBottom: 24 },
  gridContainer: { gap: 16 },
  cardBtn: {
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)' },
  backToUserBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6200EA',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backToUserText: {
    color: '#6200EA',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
