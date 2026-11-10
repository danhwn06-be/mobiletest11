import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategorySQLite from './CategorySQLite';
import ProductSQLite from './ProductSQLite';
import UserSQLite from './UserSQLite';

const AdminDashboard = () => {
  // Biến lưu trạng thái màn hình hiện tại ('home' | 'users' | 'categories' | 'products')
  const [screen, setScreen] = useState<'home' | 'users' | 'categories' | 'products'>('home');

  // Điều hướng chuyển màn hình
  if (screen === 'users') return <UserSQLite onBack={() => setScreen('home')} />;
  if (screen === 'categories') return <CategorySQLite onBack={() => setScreen('home')} />;
  if (screen === 'products') return <ProductSQLite onBack={() => setScreen('home')} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRANG CHỦ QUẢN TRỊ</Text>

      {/* Nút 1: Quản lý user */}
      <TouchableOpacity style={styles.btnUser} onPress={() => setScreen('users')}>
        <Text style={styles.btnText}>👥 Quản lý user</Text>
      </TouchableOpacity>

      {/* Nút 2: Quản lý loại sản phẩm */}
      <TouchableOpacity style={styles.btnCat} onPress={() => setScreen('categories')}>
        <Text style={styles.btnText}>🏷️ Quản lý loại sản phẩm</Text>
      </TouchableOpacity>

      {/* Nút 3: Quản lý sản phẩm */}
      <TouchableOpacity style={styles.btnProd} onPress={() => setScreen('products')}>
        <Text style={styles.btnText}>📦 Quản lý sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333333',
  },
  btnUser: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  btnCat: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  btnProd: {
    backgroundColor: '#fd7e14',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
