import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeStackScreen';
import AdminDashboard from './admin/AdminDashboard';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';

export type AdminBottomTabParamList = {
  HomeUser: undefined;
  HomeAdmin: undefined;
  Signup: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator<AdminBottomTabParamList>();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EA',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? 8 : 6,
          paddingTop: 6,
          height: 64,
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
          title: 'Home User',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="HomeAdmin"
        component={AdminDashboard}
        options={{
          title: 'Home Admin',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Signup"
        component={SignupSqlite}
        options={{
          title: 'Signup',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>➕</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginSqlite}
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔒</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
