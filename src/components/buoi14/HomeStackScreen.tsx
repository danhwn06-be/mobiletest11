import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen, { HomeStackParamList } from './HomeScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductsByCategoryScreen from './ProductsByCategoryScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';

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
      <Stack.Screen name="LoginSqlite" component={LoginSqlite} options={{ title: 'Đăng nhập', headerShown: false }} />
      <Stack.Screen name="SignupSqlite" component={SignupSqlite} options={{ title: 'Đăng ký', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
