import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserByCredentials } from './database';

const LoginSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<{ id: number; username: string; role: string } | null>(null);
  const navigation = useNavigation<any>();

  // Kiểm tra phiên đăng nhập hiện tại mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const checkCurrentSession = async () => {
        const data = await AsyncStorage.getItem('loggedInUser');
        if (data) {
          setLoggedInUser(JSON.parse(data));
        } else {
          setLoggedInUser(null);
        }
      };
      checkCurrentSession();
    }, [])
  );

  const handleLogoutCurrentSession = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản hiện tại?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          setLoggedInUser(null);
          setUsername('');
          setPassword('');
          Alert.alert('Đã đăng xuất', 'Bây giờ bạn có thể đăng nhập tài khoản khác!');
        },
      },
    ]);
  };

  const handleLogin = async () => {
    if (loggedInUser) {
      Alert.alert(
        'Yêu cầu đăng xuất',
        `Bạn đang đăng nhập với tài khoản "${loggedInUser.username}". Vui lòng đăng xuất trước khi đăng nhập tài khoản khác!`
      );
      return;
    }

    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    try {
      const user = await getUserByCredentials(username.trim(), password.trim());
      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        Alert.alert('Thành công 🎉', `Xin chào, ${user.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              if (user.role === 'admin') {
                navigation.navigate('HomeAdmin' as any);
              } else {
                navigation.navigate('HomeUser' as any);
              }
            },
          },
        ]);
      } else {
        Alert.alert('Thất bại', 'Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng nhập thất bại, vui lòng thử lại!');
    }
  };

  // Giao diện khi ĐÃ CÓ TÀI KHOẢN ĐĂNG NHẬP (Chặn đăng nhập đè)
  if (loggedInUser) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logoIcon}>👤</Text>
          <Text style={styles.title}>Bạn Đã Đăng Nhập</Text>
          <Text style={styles.subtitle}>
            Bạn đang đăng nhập với tài khoản <Text style={styles.highlightText}>"{loggedInUser.username}"</Text>.
            Vui lòng đăng xuất tài khoản này trước khi đăng nhập tài khoản khác!
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#E53935' }]}
            onPress={handleLogoutCurrentSession}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🚪 ĐĂNG XUẤT NGAY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLinkBtn}
            onPress={() => navigation.navigate('HomeUser')}
          >
            <Text style={styles.backLinkText}>🛍️ Quay lại cửa hàng mua sắm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Giao diện Đăng Nhập bình thường khi CHƯA ĐĂNG NHẬP
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoIcon}>🔒</Text>
        <Text style={styles.title}>Đăng Nhập Tài Khoản</Text>
        <Text style={styles.subtitle}>Chào mừng bạn quay trở lại ứng dụng mua sắm</Text>

        <TextInput
          placeholder="Tên đăng nhập"
          placeholderTextColor="#9E9E9E"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#9E9E9E"
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.switchText}>
            Chưa có tài khoản? <Text style={styles.highlightText}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLinkBtn}
          onPress={() => navigation.navigate('HomeUser')}
        >
          <Text style={styles.backLinkText}>← Quay lại cửa hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FA' },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, elevation: 4, alignItems: 'center' },
  logoIcon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6200EA', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#757575', marginBottom: 20, textAlign: 'center', lineHeight: 18 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 14, color: '#212121', fontSize: 15 },
  button: { backgroundColor: '#6200EA', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 6, elevation: 2 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  switchText: { marginTop: 18, color: '#616161', fontSize: 14 },
  highlightText: { color: '#6200EA', fontWeight: 'bold' },
  backLinkBtn: { marginTop: 16, paddingVertical: 8 },
  backLinkText: { color: '#757575', fontSize: 14, fontWeight: 'bold' },
});

export default LoginSqlite;
