import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { User, addUser, deleteUser, fetchUsers, initDatabase, updateUser } from '../database';

const UserManagement = ({ onBack }: { onBack?: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    initDatabase(() => loadData());
  }, []);

  const loadData = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleAddOrUpdate = async () => {
    if (!username.trim() || !password.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập Tên đăng nhập và Mật khẩu!');
    }

    if (editingId !== null) {
      await updateUser({ id: editingId, username: username.trim(), password: password.trim(), role });
      setEditingId(null);
      Alert.alert('Thành công', 'Đã cập nhật tài khoản người dùng!');
    } else {
      const success = await addUser(username.trim(), password.trim(), role);
      if (success) {
        Alert.alert('Thành công', 'Đã thêm tài khoản mới!');
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại!');
      }
    }

    setUsername('');
    setPassword('');
    setRole('user');
    loadData();
  };

  const handleEdit = (item: User) => {
    setUsername(item.username);
    setPassword(item.password);
    setRole(item.role);
    setEditingId(item.id);
  };

  const handleDelete = (id: number, uname: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc chắn muốn xóa tài khoản "${uname}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteUser(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnBackText}>⬅️ Quay lại Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>👥 Quản lý user</Text>

      {/* Form nhập liệu */}
      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập..."
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu..."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Chọn quyền role */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'user' && styles.roleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={role === 'user' ? styles.btnTextText : styles.roleText}>Vai trò: USER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'admin' && styles.roleActiveAdmin]}
            onPress={() => setRole('admin')}
          >
            <Text style={role === 'admin' ? styles.btnTextText : styles.roleText}>Vai trò: ADMIN</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
          <Text style={styles.btnTextText}>{editingId ? 'Cập nhật User' : 'Thêm User mới'}</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách người dùng */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.username}</Text>
              <Text style={styles.userSub}>Mật khẩu: {item.password}</Text>
              <Text style={[styles.roleBadge, item.role === 'admin' ? styles.adminBadge : styles.userBadge]}>
                Role: {item.role}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id, item.username)}>
                <Text style={styles.icon}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    backgroundColor: '#F8F9FA',
  },
  btnBack: { backgroundColor: '#6C757D', padding: 8, borderRadius: 6, marginBottom: 12, alignSelf: 'flex-start' },
  btnBackText: { color: '#FFFFFF', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 12, textAlign: 'center' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 16, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 10, marginBottom: 10, color: '#212121' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  roleBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, alignItems: 'center' },
  roleActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  roleActiveAdmin: { backgroundColor: '#E53935', borderColor: '#E53935' },
  roleText: { color: '#424242', fontWeight: 'bold', fontSize: 12 },
  btnSave: { backgroundColor: '#6200EA', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnTextText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 1,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  userSub: { fontSize: 12, color: '#757575', marginVertical: 2 },
  roleBadge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  adminBadge: { backgroundColor: '#FFEBEE', color: '#C62828' },
  userBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
  actionRow: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 6 },
  icon: { fontSize: 18 },
});

export default UserManagement;
