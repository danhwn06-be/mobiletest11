import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen, { HomeStackParamList } from './HomeScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductsByCategoryScreen from './ProductsByCategoryScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import UserManagement from './admin/UserManagement';
import CategoryManagement from './admin/CategoryManagement';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#6200EA' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} options={{ title: 'Danh mục sản phẩm' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Lịch sử mua hàng' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Trang cá nhân' }} />
      <Stack.Screen name="UserManagement" component={UserManagement} options={{ title: 'Quản lý user' }} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagement} options={{ title: 'Quản lý loại sản phẩm' }} />
      <Stack.Screen name="ProductManagement" component={ProductManagement} options={{ title: 'Quản lý sản phẩm' }} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} options={{ title: 'Quản lý đơn hàng' }} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
