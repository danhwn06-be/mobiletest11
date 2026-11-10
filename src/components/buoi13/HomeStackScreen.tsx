import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen, { HomeStackParamList } from './HomeScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductsByCategoryScreen from './ProductsByCategoryScreen';
import AdminDashboard from './admin/AdminDashboard';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
