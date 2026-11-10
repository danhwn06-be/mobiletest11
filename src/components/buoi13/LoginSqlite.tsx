import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserByCredentials } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { BottomTabParamList } from './AppTabs';

const LoginSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation1 = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const navigation2 = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const user = await getUserByCredentials(username, password);
      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        Alert.alert('Thành công', `Xin chào, ${user.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              navigation1.navigate(user.role === 'admin' ? 'AdminDashboard' : 'Home');
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation2.navigate('SignupSqlite')}>
        <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#6200ea' },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
  button: { backgroundColor: '#6200ea', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 6, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  switchText: { marginTop: 15, color: '#6200ea', fontWeight: '500' },
});

export default LoginSqlite;
