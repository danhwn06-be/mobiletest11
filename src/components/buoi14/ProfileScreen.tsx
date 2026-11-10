import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { updateUser, User } from './database';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Tải lại thông tin người dùng mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const data = await AsyncStorage.getItem('loggedInUser');
        if (data) {
          const u: User = JSON.parse(data);
          setUser(u);
          setUsername(u.username);
          setPassword(u.password);
        } else {
          setUser(null);
          setUsername('');
          setPassword('');
        }
      };
      loadUser();
    }, [])
  );

  const handleUpdate = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Tên đăng nhập và Mật khẩu không được để trống!');
      return;
    }

    if (!user) return;

    const updatedUser: User = {
      ...user,
      username: username.trim(),
      password: password.trim(),
    };

    const success = await updateUser(updatedUser);
    if (success) {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      Alert.alert('Thành công 🎉', 'Cập nhật thông tin cá nhân thành công!');
    } else {
      Alert.alert('Lỗi', 'Cập nhật thất bại, vui lòng thử lại!');
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          setUser(null);
          setUsername('');
          setPassword('');
          Alert.alert('Đã đăng xuất', 'Hẹn gặp lại bạn lần sau!');
        },
      },
    ]);
  };

  // Giao diện khi CHƯA ĐĂNG NHẬP (Guest Mode)
  if (!user) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>👤 Tài Khoản</Text>

        <View style={styles.guestCard}>
          <Text style={styles.guestIcon}>🛍️</Text>
          <Text style={styles.guestTitle}>Chào mừng quý khách!</Text>
          <Text style={styles.guestSubtitle}>
            Đăng nhập để theo dõi đơn hàng, quản lý tài khoản và nhận nhiều ưu đãi mua sắm hấp dẫn.
          </Text>

          <TouchableOpacity
            style={styles.loginPrimaryBtn}
            onPress={() => navigation.navigate('Login' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.loginPrimaryBtnText}>🔒 Đăng Nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupSecondaryBtn}
            onPress={() => navigation.navigate('Signup' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.signupSecondaryBtnText}>📝 Đăng Ký Tài Khoản Mới</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Text style={styles.menuText}>🛒 Giỏ hàng của bạn</Text>
            <Text style={styles.arrowText}>❯</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Giao diện khi ĐÃ ĐĂNG NHẬP (User hoặc Admin)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>👤 Thông Tin Cá Nhân</Text>

      {/* Card Thông tin User */}
      <View style={styles.avatarCard}>
        <Text style={styles.avatarIcon}>{user.role === 'admin' ? '👑' : '👤'}</Text>
        <Text style={styles.usernameDisplay}>{user.username}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.roleDisplay}>
            {user.role === 'admin' ? '🔑 Quản trị viên (Admin)' : '👤 Khách hàng thành viên'}
          </Text>
        </View>
      </View>

      {/* Nút vào Bảng Quản Trị ADMIN - CHỈ HIỂN THỊ NẾU LÀ ADMIN */}
      {user.role === 'admin' && (
        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation.navigate('HomeUser' as any, { screen: 'AdminDashboard' })}
          activeOpacity={0.85}
        >
          <View style={styles.adminCardContent}>
            <Text style={styles.adminIcon}>⚙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminTitle}>Trang Quản Trị Hệ Thống</Text>
              <Text style={styles.adminSubtitle}>
                Quản lý User, Loại sản phẩm & Danh sách sản phẩm
              </Text>
            </View>
            <Text style={styles.adminArrow}>❯</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Card Chỉnh sửa thông tin */}
      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Chỉnh sửa thông tin cá nhân</Text>

        <Text style={styles.label}>Tên đăng nhập:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={styles.saveBtnText}>💾 Lưu Thay Đổi</Text>
        </TouchableOpacity>
      </View>

      {/* Danh mục tiện ích */}
      <View style={styles.actionCard}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('HomeUser', { screen: 'OrderHistory' })}
        >
          <Text style={styles.menuText}>📜 Lịch sử mua hàng</Text>
          <Text style={styles.arrowText}>❯</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Text style={styles.menuText}>🛒 Giỏ hàng của tôi</Text>
          <Text style={styles.arrowText}>❯</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Đăng Xuất */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutBtnText}>🚪 Đăng Xuất Tài Khoản</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    backgroundColor: '#F8F9FA',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 16 },

  // Guest Mode
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  guestIcon: { fontSize: 56, marginBottom: 12 },
  guestTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 6 },
  guestSubtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  loginPrimaryBtn: {
    backgroundColor: '#6200EA',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  loginPrimaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  signupSecondaryBtn: {
    borderWidth: 1.5,
    borderColor: '#6200EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  signupSecondaryBtnText: { color: '#6200EA', fontWeight: 'bold', fontSize: 15 },

  // Logged-in User
  avatarCard: {
    backgroundColor: '#6200EA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  avatarIcon: { fontSize: 48, marginBottom: 8 },
  usernameDisplay: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  roleDisplay: { fontSize: 12, color: '#FFD54F', fontWeight: 'bold' },

  // Admin Card Button
  adminCard: {
    backgroundColor: '#FF6F00',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  adminCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIcon: { fontSize: 32 },
  adminTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  adminSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', marginTop: 2 },
  adminArrow: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 12 },
  label: { fontSize: 13, color: '#616161', marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#212121',
  },
  saveBtn: {
    backgroundColor: '#6200EA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  arrowText: { fontSize: 16, color: '#757575' },
  divider: { height: 1, backgroundColor: '#EEEEEE' },

  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutBtnText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 15 },
});

export default ProfileScreen;
