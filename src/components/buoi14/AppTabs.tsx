import React, { useState, useCallback } from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeStackScreen from './HomeStackScreen';
import AdminDashboard from './admin/AdminDashboard';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';

export type AdminBottomTabParamList = {
  HomeUser: undefined;
  HomeAdmin?: undefined;
  Signup: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator<AdminBottomTabParamList>();

const AppTabs = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkAdminState = async () => {
        try {
          const data = await AsyncStorage.getItem('loggedInUser');
          if (data) {
            const user = JSON.parse(data);
            setIsAdmin(user.role === 'admin');
          } else {
            setIsAdmin(false);
          }
        } catch {
          setIsAdmin(false);
        }
      };
      checkAdminState();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EA',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? 10 : 6,
          paddingTop: 6,
          height: 68,
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="HomeAdmin"
          component={AdminDashboard}
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>⚙️</Text>
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Signup"
        component={SignupSqlite}
        options={{
          title: 'Sign up',
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
