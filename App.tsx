import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './src/components/buoi14/AppTabs';
import LoginSqlite from './src/components/buoi14/LoginSqlite';
import SignupSqlite from './src/components/buoi14/SignupSqlite';
import AdminDashboard from './src/components/buoi14/admin/AdminDashboard';
import CategoryManagement from './src/components/buoi14/admin/CategoryManagement';
import ProductManagement from './src/components/buoi14/admin/ProductManagement';
import UserManagement from './src/components/buoi14/admin/UserManagement';

export type RootStackParamList = {
  MainTabs: undefined;
  LoginSqlite: undefined;
  SignupSqlite: undefined;
  AdminDashboard: undefined;
  CategoryManagement: { categoryId?: number };
  ProductManagement: { categoryId?: number };
  UserManagement: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={AppTabs} />
        <RootStack.Screen name="LoginSqlite" component={LoginSqlite} />
        <RootStack.Screen name="SignupSqlite" component={SignupSqlite} />
        <RootStack.Screen name="AdminDashboard" component={AdminDashboard} />
        <RootStack.Screen name="CategoryManagement" component={CategoryManagement} />
        <RootStack.Screen name="ProductManagement" component={ProductManagement} />
        <RootStack.Screen name="UserManagement" component={UserManagement} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
