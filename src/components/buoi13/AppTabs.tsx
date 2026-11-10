import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeStackScreen';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';

export type BottomTabParamList = {
  HomeTab: undefined;
  SignupSqlite: undefined;
  LoginSqlite: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const AppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SignupSqlite"
        component={SignupSqlite}
        options={{
          title: 'Signup',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>➕</Text>
          ),
        }}
      />
      <Tab.Screen
        name="LoginSqlite"
        component={LoginSqlite}
        options={{
          title: 'Login',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔒</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
