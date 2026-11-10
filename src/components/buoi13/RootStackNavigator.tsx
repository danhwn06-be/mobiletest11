import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  LoginSqlite: undefined;
  SignupSqlite: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginSqlite">
      <Stack.Screen
        name="LoginSqlite"
        component={LoginSqlite}
        options={{ title: 'Đăng nhập', headerShown: false }}
      />
      <Stack.Screen
        name="SignupSqlite"
        component={SignupSqlite}
        options={{ title: 'Đăng ký', headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
