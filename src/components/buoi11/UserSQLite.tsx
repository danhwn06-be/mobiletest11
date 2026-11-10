import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User, addUser, deleteUser, fetchUsers, initDatabase, updateUser } from './database';

const UserSQLite = ({ onBack }: { onBack?: () => void }) => {
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
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
    }

    if (editingId !== null) {
      await updateUser({ id: editingId, username: username.trim(), password: password.trim(), role });
      setEditingId(null);
    } else {
      await addUser(username.trim(), password.trim(), role);
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

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa tài khoản này không?', [
      { text: 'Hủy' },
      { text: 'Xóa', onPress: async () => { await deleteUser(id); loadData(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnText}>⬅️ Quay lại trang chủ</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Quản Lý User</Text>

      {/* Form nhập liệu */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên đăng nhập..."
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu..."
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Chọn quyền user / admin */}
      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'user' && styles.roleActive]}
          onPress={() => setRole('user')}
        >
          <Text style={role === 'user' ? styles.btnText : styles.roleText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'admin' && styles.roleActive]}
          onPress={() => setRole('admin')}
        >
          <Text style={role === 'admin' ? styles.btnText : styles.roleText}>Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
        <Text style={styles.btnText}>{editingId ? 'Cập nhật User' : 'Thêm User mới'}</Text>
      </TouchableOpacity>

      {/* Danh sách người dùng */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.itemText}>{item.username} ({item.role})</Text>
              <Text style={styles.subText}>Mật khẩu: {item.password}</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.icon}>✏️</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.icon}>❌</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default UserSQLite;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  btnBack: { backgroundColor: '#6c757d', padding: 8, borderRadius: 6, marginBottom: 10, alignSelf: 'flex-start' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8, color: '#000' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  roleBtn: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, alignItems: 'center' },
  roleActive: { backgroundColor: '#28a745', borderColor: '#28a745' },
  roleText: { color: '#333', fontWeight: 'bold' },
  btnSave: { backgroundColor: '#28a745', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8, alignItems: 'center' },
  itemText: { fontSize: 16, color: '#000', fontWeight: 'bold' },
  subText: { fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', gap: 15 },
  icon: { fontSize: 18 },
});
