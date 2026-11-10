import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeStackScreen';

export type BottomTabParamList = {
  HomeTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
