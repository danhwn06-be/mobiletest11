import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Category, addCategory, deleteCategory, fetchCategories, initDatabase, updateCategory } from './database';

const CategorySQLite = ({ onBack }: { onBack?: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    initDatabase(() => loadData());
  }, []);

  const loadData = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên loại sản phẩm!');

    if (editingId !== null) {
      await updateCategory({ id: editingId, name: name.trim() });
      setEditingId(null);
    } else {
      await addCategory(name.trim());
    }
    setName('');
    loadData();
  };

  const handleEdit = (item: Category) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa loại sản phẩm này?', [
      { text: 'Hủy' },
      { text: 'Xóa', onPress: async () => { await deleteCategory(id); loadData(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnText}>⬅️ Quay lại trang chủ</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Quản Lý Loại Sản Phẩm</Text>

      {/* Form nhập liệu */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên loại sản phẩm..."
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
        <Text style={styles.btnText}>{editingId ? 'Cập nhật loại' : 'Thêm loại mới'}</Text>
      </TouchableOpacity>

      {/* Danh sách loại sản phẩm */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemText}>#{item.id} - {item.name}</Text>
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

export default CategorySQLite;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  btnBack: { backgroundColor: '#6c757d', padding: 8, borderRadius: 6, marginBottom: 10, alignSelf: 'flex-start' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10, color: '#000' },
  btnSave: { backgroundColor: '#007bff', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8, alignItems: 'center' },
  itemText: { fontSize: 16, color: '#000', fontWeight: '500' },
  row: { flexDirection: 'row', gap: 15 },
  icon: { fontSize: 18 },
});
