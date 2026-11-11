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
import { Category, addCategory, deleteCategory, fetchCategories, initDatabase, updateCategory } from '../database';
import ProductManagement from './ProductManagement';

const CategoryManagement = ({ onBack }: { onBack?: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCatIdForAddProduct, setSelectedCatIdForAddProduct] = useState<number | null>(null);

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
      Alert.alert('Thành công', 'Đã cập nhật loại sản phẩm!');
    } else {
      await addCategory(name.trim());
      Alert.alert('Thành công', 'Đã thêm loại sản phẩm mới!');
    }
    setName('');
    loadData();
  };

  const handleEdit = (item: Category) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = (id: number, cname: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa loại sản phẩm "${cname}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(id);
          loadData();
        },
      },
    ]);
  };

  if (selectedCatIdForAddProduct !== null) {
    return (
      <ProductManagement
        initialCategoryId={selectedCatIdForAddProduct}
        onBack={() => setSelectedCatIdForAddProduct(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnBackText}>⬅️ Quay lại Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>🏷️ Quản lý loại sản phẩm</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên loại sản phẩm mới..."
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
          <Text style={styles.btnSaveText}>{editingId ? 'Cập Nhật Loại' : 'Thêm Loại Mới'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.catInfo}>
              <Text style={styles.catName}>#{item.id} - {item.name}</Text>
            </View>

            <TouchableOpacity
              style={styles.btnAddProd}
              onPress={() => setSelectedCatIdForAddProduct(item.id)}
            >
              <Text style={styles.btnAddProdText}>+ Thêm SP</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id, item.name)}>
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
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 10, marginBottom: 12, color: '#212121' },
  btnSave: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnSaveText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
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
  catInfo: { flex: 1 },
  catName: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  btnAddProd: { backgroundColor: '#E8EAF6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 10 },
  btnAddProdText: { color: '#3F51B5', fontWeight: 'bold', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 6 },
  iconBtn: { padding: 4 },
  icon: { fontSize: 18 },
});

export default CategoryManagement;
