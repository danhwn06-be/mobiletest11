import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Category,
  Product,
  addProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  initDatabase,
  updateProduct,
} from '../database';

interface Props {
  initialCategoryId?: number;
  onBack?: () => void;
}

const getImageSource = (img: string) => {
  if (img && (img.startsWith('file://') || img.startsWith('http'))) return { uri: img };
  switch (img) {
    case 'hinh1.jpg':
      return require('../../../assets/book_images/hinh1.jpg');
    case 'hinh2.jpg':
      return require('../../../assets/book_images/hinh2.jpg');
    case 'hinh3.jpg':
      return require('../../../assets/book_images/hinh3.jpg');
    case 'hinh4.jpg':
      return require('../../../assets/book_images/hinh4.jpg');
    default:
      return require('../../../assets/book_images/hinh1.jpg');
  }
};

const ProductManagement = ({ initialCategoryId, onBack }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(initialCategoryId || 1);
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
    if (cats.length > 0 && !initialCategoryId) setCategoryId(cats[0].id);
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

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      (res) => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.errorCode) {
          Alert.alert('Lỗi chọn ảnh', res.errorMessage || `Mã lỗi: ${res.errorCode}`);
        } else if (res.assets && res.assets[0]?.uri) {
          setImageUri(res.assets[0].uri);
        }
      }
    );
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !price.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập Tên sản phẩm và Giá bán!');
    }

    const prodData = {
      name: name.trim(),
      price: parseFloat(price),
      img: imageUri || 'hinh1.jpg',
      categoryId,
    };

    if (editingId !== null) {
      await updateProduct({ id: editingId, ...prodData });
      setEditingId(null);
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm!');
    } else {
      await addProduct(prodData);
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới!');
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

  const handleDelete = (id: number, pname: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa sản phẩm "${pname}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnBackText}>⬅️ Quay lại Dashboard</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>📦 Quản Lý Sản Phẩm</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm..."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá bán (VNĐ)..."
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.btnImage} onPress={handlePickImage}>
          <Text style={styles.btnImageText}>
            {imageUri ? '📷 Đã chọn ảnh (Nhấp để chọn lại)' : '📷 Chọn hình ảnh từ thiết bị'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Chọn loại sản phẩm:</Text>
        <View style={styles.catRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, categoryId === c.id && styles.chipActive]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text style={categoryId === c.id ? styles.chipActiveText : styles.chipText}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnSave} onPress={handleAddOrUpdate}>
          <Text style={styles.btnSaveText}>{editingId ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Text>
        </TouchableOpacity>
      </View>

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
                <Text style={styles.catBadge}>Danh mục: {catName}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.icon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id, item.name)}>
                  <Text style={styles.icon}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
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
  btnImage: { backgroundColor: '#8E24AA', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnImageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#616161', marginBottom: 6 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F3F5', borderWidth: 1, borderColor: '#E0E0E0' },
  chipActive: { backgroundColor: '#FF9800', borderColor: '#FF9800' },
  chipText: { color: '#424242', fontSize: 12 },
  chipActiveText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  btnSave: { backgroundColor: '#FF9800', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnSaveText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 1,
  },
  img: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  info: { flex: 1 },
  prodName: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  price: { color: '#E53935', fontWeight: 'bold', fontSize: 14, marginVertical: 2 },
  catBadge: { fontSize: 11, color: '#757575' },
  actionRow: { flexDirection: 'row', gap: 6 },
  iconBtn: { padding: 4 },
  icon: { fontSize: 18 },
});

export default ProductManagement;
