import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Category, Product, addProduct, deleteProduct, fetchCategories, fetchProducts, initDatabase, updateProduct } from './database';

const ProductSQLite = ({ onBack }: { onBack?: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    initDatabase(() => loadData());
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts([...prods].reverse());
    if (cats.length > 0 && categoryId === 1) setCategoryId(cats[0].id);
  };

  const getImageSource = (img: string) => {
    if (img && (img.startsWith('file://') || img.startsWith('http'))) return { uri: img };
    return require('../../assests/orkut.png');
  };

  const requestImagePermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) {
      Alert.alert(
        'Quyền truy cập thư viện ảnh',
        'Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình ảnh sản phẩm. Vui lòng cấp quyền trong cài đặt thiết bị!'
      );
      return;
    }

    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 }, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorCode) {
        Alert.alert('Lỗi chọn ảnh', res.errorMessage || `Mã lỗi: ${res.errorCode}`);
      } else if (res.assets && res.assets[0]?.uri) {
        setImageUri(res.assets[0].uri);
      }
    });
  };

  const handleAddOrUpdate = async () => {
    if (!name || !price) return Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm!');

    const prodData = {
      name,
      price: parseFloat(price),
      img: imageUri || 'hinh1.jpg',
      categoryId,
    };

    if (editingId !== null) {
      await updateProduct({ id: editingId, ...prodData });
      setEditingId(null);
    } else {
      await addProduct(prodData);
    }

    setName('');
    setPrice('');
    setImageUri(null);
    loadData();
  };

  const handleEdit = (item: Product) => {
    setName(item.name);
    setPrice(item.price.toString());
    setCategoryId(item.categoryId);
    setImageUri(item.img);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa sản phẩm này?', [
      { text: 'Hủy' },
      { text: 'Xóa', onPress: async () => { await deleteProduct(id); loadData(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnText}>⬅️ Quay lại trang chủ</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Quản Lý Sản Phẩm</Text>

      {/* Form nhập liệu */}
      <TextInput style={styles.input} placeholder="Tên sản phẩm..." value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Giá sản phẩm..." keyboardType="numeric" value={price} onChangeText={setPrice} />

      <TouchableOpacity style={styles.btnImage} onPress={handlePickImage}>
        <Text style={styles.btnText}>{imageUri ? '📷 Đã chọn ảnh (Bấm để chọn lại)' : '📷 Chọn hình ảnh'}</Text>
      </TouchableOpacity>

      {/* Chọn danh mục loại sản phẩm */}
      <View style={styles.catRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, categoryId === c.id && styles.chipActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <Text style={categoryId === c.id ? styles.btnText : styles.chipText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
        <Text style={styles.btnText}>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</Text>
      </TouchableOpacity>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const catName = categories.find((c) => c.id === item.categoryId)?.name || 'Khác';
          return (
            <View style={styles.card}>
              <Image source={getImageSource(item.img)} style={styles.img} />
              <View style={styles.info}>
                <Text style={styles.prodName}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
                <Text style={styles.catBadge}>Loại: {catName}</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.icon}>✏️</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.icon}>❌</Text></TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ProductSQLite;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  btnBack: { backgroundColor: '#6c757d', padding: 8, borderRadius: 6, marginBottom: 10, alignSelf: 'flex-start' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8, color: '#000' },
  btnImage: { backgroundColor: '#8e44ad', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 16, backgroundColor: '#f0f0f0' },
  chipActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  chipText: { color: '#333' },
  btnSave: { backgroundColor: '#fd7e14', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 14 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8, alignItems: 'center' },
  img: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  info: { flex: 1 },
  prodName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  price: { color: '#e53935', fontWeight: 'bold', fontSize: 13 },
  catBadge: { fontSize: 11, color: '#666' },
  row: { flexDirection: 'row', gap: 12 },
  icon: { fontSize: 18 },
});
