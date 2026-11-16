import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, Category, fetchCategories } from './database';
import CategorySelector from './CategorySelector';
import { HomeStackParamList } from './HomeScreen';
import { addToCart } from './CartManager';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const getImageSource = (img: string) => {
  if (img && (img.startsWith('file://') || img.startsWith('http'))) return { uri: img };
  switch (img) {
    case 'hinh1.jpg':
      return require('../../assets/book_images/hinh1.jpg');
    case 'hinh2.jpg':
      return require('../../assets/book_images/hinh2.jpg');
    case 'hinh3.jpg':
      return require('../../assets/book_images/hinh3.jpg');
    case 'hinh4.jpg':
      return require('../../assets/book_images/hinh4.jpg');
    default:
      return require('../../assets/book_images/hinh1.jpg');
  }
};

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { product } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (buyNow: boolean = false) => {
    if (isOutOfStock) {
      Alert.alert('Hết hàng', `Sản phẩm "${product.name}" hiện đã hết hàng trong kho!`);
      return;
    }
    if (quantity > product.stock) {
      Alert.alert('Lỗi số lượng', `Kho hiện chỉ còn ${product.stock} sản phẩm. Vui lòng chọn số lượng ít hơn!`);
      return;
    }

    await addToCart(product, quantity);
    if (buyNow) {
      navigation.navigate('Cart');
    } else {
      Alert.alert('Thành công 🎉', `Đã thêm ${quantity} x "${product.name}" vào giỏ hàng!`);
    }
  };

  const handleSelectCategory = (id: number) => {
    navigation.navigate('ProductsByCategory', { categoryId: id });
  };

  const currentCat = categories.find((c) => c.id === product.categoryId);

  return (
    <View style={styles.flex1}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hình ảnh sản phẩm lớn */}
        <View style={styles.imageCard}>
          <Image source={getImageSource(product.img)} style={styles.productImage} />
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.infoCard}>
          <View style={styles.catRow}>
            <Text style={styles.catBadge}>🏷️ {currentCat ? currentCat.name : 'Loại sản phẩm'}</Text>
            <Text style={[styles.stockBadge, isOutOfStock && styles.outOfStockBadge]}>
              {isOutOfStock ? '❌ Hết hàng' : `Kho còn: ${product.stock}`}
            </Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toLocaleString('vi-VN')} đ</Text>

          <Text style={styles.descTitle}>Mô tả sản phẩm:</Text>
          <Text style={styles.descText}>
            Sản phẩm chất lượng cao, thoáng mát, thiết kế thời trang hiện đại phù hợp mặc đi làm, đi chơi hay dự tiệc.
          </Text>

          {/* Chọn số lượng */}
          {!isOutOfStock && (
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Số lượng:</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Danh mục liên quan */}
        <View style={styles.catSection}>
          <Text style={styles.catSectionTitle}>Khám phá thêm các danh mục:</Text>
          <CategorySelector
            categories={categories}
            selectedId={product.categoryId}
            onSelect={handleSelectCategory}
          />
        </View>
      </ScrollView>

      {/* Thanh nút bấm đặt hàng dưới cùng */}
      <View style={styles.bottomBar}>
        {isOutOfStock ? (
          <View style={styles.outOfStockBar}>
            <Text style={styles.outOfStockText}>🚫 HÀNG HIỆN TẠI ĐÃ HẾT TRONG KHO</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(false)}>
              <Text style={styles.cartBtnText}>🛒 Thêm vào giỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowBtn} onPress={() => handleAddToCart(true)}>
              <Text style={styles.buyNowBtnText}>⚡ Mua Ngay</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { paddingBottom: 100 },
  imageCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  productImage: { width: '100%', height: 230, resizeMode: 'contain' },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  catBadge: { color: '#6200EA', fontWeight: 'bold', fontSize: 13 },
  stockBadge: { color: '#2E7D32', backgroundColor: '#E8F5E9', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  outOfStockBadge: { color: '#C62828', backgroundColor: '#FFEBEE' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#E53935', marginBottom: 16 },
  descTitle: { fontSize: 15, fontWeight: 'bold', color: '#424242', marginBottom: 4 },
  descText: { fontSize: 14, color: '#616161', lineHeight: 20, marginBottom: 16 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  quantityLabel: { fontSize: 15, fontWeight: 'bold', color: '#212121' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F5', borderRadius: 8 },
  qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
  qtyVal: { paddingHorizontal: 16, fontSize: 16, fontWeight: 'bold', color: '#212121' },
  catSection: { marginHorizontal: 16, marginTop: 20 },
  catSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  cartBtn: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartBtnText: { color: '#3F51B5', fontWeight: 'bold', fontSize: 15 },
  buyNowBtn: {
    flex: 1,
    backgroundColor: '#6200EA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyNowBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  outOfStockBar: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  outOfStockText: { color: '#757575', fontWeight: 'bold', fontSize: 14 },
});

export default ProductDetailScreen;
