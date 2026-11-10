import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import HomeStackScreen from './HomeStackScreen';
import ProductsByCategoryScreen from './ProductsByCategoryScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import { getCart } from './CartManager';

export type AppBottomTabParamList = {
  HomeUser: undefined;
  CategoryTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type AdminBottomTabParamList = AppBottomTabParamList;

const Tab = createBottomTabNavigator<AppBottomTabParamList>();

const AppTabs = () => {
  const [cartCount, setCartCount] = useState(0);

  // Cập nhật số lượng giỏ hàng để hiển thị badge trên tab bar
  useFocusEffect(
    useCallback(() => {
      const updateCount = async () => {
        const cart = await getCart();
        const total = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      };
      updateCount();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EA',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: '#EEEEEE',
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="HomeUser"
        component={HomeStackScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CategoryTab"
        component={ProductsByCategoryScreen}
        options={{
          title: 'Danh mục',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏷️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🛒</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
