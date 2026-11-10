import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from './AppTabs';

const Header = () => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    setUser(null);
    navigation.navigate('LoginSqlite');
  };

  return (
    <View style={styles.header}>
      {user ? (
        <>
          <Text style={styles.userInfo}>
            {user && user.username && user.role ? (
              <Text style={styles.userInfo}>
                Xin chào, {String(user.username)} ({String(user.role)})
              </Text>
            ) : null}
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#6200ea',
  },
  userInfo: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff5252',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;
