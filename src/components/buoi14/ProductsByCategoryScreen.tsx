import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { Product, Category, fetchCategories, fetchProductsByCategory } from './database';
import CategorySelector from './CategorySelector';
import { addToCart } from './CartManager';

import PriceRangeSelector, { PRICE_RANGES, PriceRange } from './PriceRangeSelector';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type RouteProps = RouteProp<HomeStackParamList, 'ProductsByCategory'>;

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

export default function ProductsByCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryId } = route.params || { categoryId: 1 };

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCatId, setSelectedCatId] = useState(categoryId);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(PRICE_RANGES[0]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetchProductsByCategory(selectedCatId).then(setProducts);
  }, [selectedCatId]);

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
    Alert.alert('Thành công 🎉', `Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const selectedCat = categories.find((c) => c.id === selectedCatId);

  const filteredProducts = products.filter(
    (p) => p.price >= selectedPriceRange.minPrice && p.price <= selectedPriceRange.maxPrice
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Danh Mục: {selectedCat ? selectedCat.name : ''}</Text>
        <CategorySelector
          categories={categories}
          selectedId={selectedCatId}
          onSelect={(id) => setSelectedCatId(id)}
        />
        <PriceRangeSelector
          selectedRangeId={selectedPriceRange.id}
          onSelectRange={(range) => setSelectedPriceRange(range)}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            activeOpacity={0.8}
          >
            <Image source={getImageSource(item.img)} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Text style={styles.addBtnText}>+ Giỏ</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Chưa có sản phẩm nào thuộc loại này.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerArea: { backgroundColor: '#FFFFFF', padding: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 6 },
  listContainer: { padding: 12 },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 15, color: '#212121' },
  price: { color: '#E53935', fontWeight: 'bold', fontSize: 14, marginTop: 4 },
  addBtn: {
    backgroundColor: '#6200EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  emptyView: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#757575', fontSize: 15 },
});
