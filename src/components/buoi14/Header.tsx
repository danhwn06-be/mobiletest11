import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCart } from './CartManager';

const Header = () => {
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      const loadUserAndCart = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
        const cart = await getCart();
        const totalCount = cart.reduce((acc, i) => acc + i.quantity, 0);
        setCartCount(totalCount);
      };
      loadUserAndCart();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          setUser(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoRow}>
        {user ? (
          <TouchableOpacity onPress={() => navigation.navigate('HomeUser' as any, { screen: 'Profile' })}>
            <Text style={styles.greetingText}>
              👋 Xin chào, <Text style={styles.usernameText}>{user.username}</Text>
            </Text>
            <Text style={styles.roleBadge}>{user.role === 'admin' ? '🔑 Quản trị viên' : '👤 Thành viên'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Login' as any)}>
            <Text style={styles.loginLink}>🔒 Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsRow}>
        {/* Nút Admin nhanh - CHỈ HIỂN THỊ KHI ĐĂNG NHẬP ROLE ADMIN */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: '#FF6F00' }]}
            onPress={() => navigation.navigate('HomeUser' as any, { screen: 'AdminDashboard' })}
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        )}

        {/* Nút Giỏ hàng */}
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CartTab' as any)}>
          <Text style={styles.iconText}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {user && (
          <>
            {/* Nút Lịch sử đơn hàng */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('HomeUser' as any, { screen: 'OrderHistory' })}>
              <Text style={styles.iconText}>📜</Text>
            </TouchableOpacity>

            {/* Nút Đăng xuất */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 12,
    backgroundColor: '#6200EA',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userInfoRow: {
    flex: 1,
  },
  greetingText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  usernameText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  roleBadge: {
    color: '#FFD54F',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  loginLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Header;
