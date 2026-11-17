import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { addUser } from './database';

const SignupSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
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
          Alert.alert('Đã đăng xuất', 'Bây giờ bạn có thể đăng ký tài khoản mới!');
        },
      },
    ]);
  };

  const handleSignup = async () => {
    if (loggedInUser) {
      Alert.alert(
        'Yêu cầu đăng xuất',
        `Bạn đang đăng nhập với tài khoản "${loggedInUser.username}". Vui lòng đăng xuất trước khi đăng ký tài khoản mới!`
      );
      return;
    }

    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    try {
      const success = await addUser(username.trim(), password.trim(), role);
      if (success) {
        Alert.alert('Thành công 🎉', 'Đăng ký tài khoản thành công!', [
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng ký thất bại, vui lòng thử lại!');
    }
  };

  // Giao diện khi ĐÃ CÓ TÀI KHOẢN ĐĂNG NHẬP (Chặn đăng ký mới khi đang đăng nhập)
  if (loggedInUser) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logoIcon}>👤</Text>
          <Text style={styles.title}>Bạn Đã Đăng Nhập</Text>
          <Text style={styles.subtitle}>
            Bạn đang đăng nhập với tài khoản <Text style={styles.highlightText}>"{loggedInUser.username}"</Text>.
            Vui lòng đăng xuất tài khoản hiện tại trước khi đăng ký tài khoản mới!
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

  // Giao diện Đăng Ký bình thường khi CHƯA ĐĂNG NHẬP
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoIcon}>📝</Text>
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới để trải nghiệm mua sắm</Text>

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

        {/* Chọn quyền mặc định */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'user' && styles.roleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={role === 'user' ? styles.roleTextActive : styles.roleText}>Khách hàng (User)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'admin' && styles.roleActiveAdmin]}
            onPress={() => setRole('admin')}
          >
            <Text style={role === 'admin' ? styles.roleTextActive : styles.roleText}>Quản trị (Admin)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
          <Text style={styles.buttonText}>ĐĂNG KÝ MỚI</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>
            Đã có tài khoản? <Text style={styles.highlightText}>Đăng nhập ngay</Text>
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
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 12, color: '#212121', fontSize: 15 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16, width: '100%' },
  roleBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, alignItems: 'center' },
  roleActive: { backgroundColor: '#6200EA', borderColor: '#6200EA' },
  roleActiveAdmin: { backgroundColor: '#E53935', borderColor: '#E53935' },
  roleText: { color: '#616161', fontSize: 12, fontWeight: '600' },
  roleTextActive: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  button: { backgroundColor: '#6200EA', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 4, elevation: 2 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  switchText: { marginTop: 18, color: '#616161', fontSize: 14 },
  highlightText: { color: '#6200EA', fontWeight: 'bold' },
  backLinkBtn: { marginTop: 16, paddingVertical: 8 },
  backLinkText: { color: '#757575', fontSize: 14, fontWeight: 'bold' },
});

export default SignupSqlite;
