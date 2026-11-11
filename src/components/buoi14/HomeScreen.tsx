import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Header from './Header';
import CategorySelector from './CategorySelector';
import PriceRangeSelector, { PRICE_RANGES, PriceRange } from './PriceRangeSelector';
import { Product, Category, initDatabase, fetchProducts, fetchCategories } from './database';
import { addToCart } from './CartManager';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
  Cart: undefined;
  Checkout: { cartItems: any[]; totalAmount: number };
  OrderHistory: undefined;
  Profile: undefined;
  CategoryManagement: { categoryId?: number };
  ProductManagement: { categoryId?: number };
  UserManagement: undefined;
};

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const getImageSource = (img: string) => {
  if (img && (img.startsWith('file://') || img.startsWith('http'))) {
    return { uri: img };
  }
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

const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  let strClean = str.toLowerCase();
  strClean = strClean.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  strClean = strClean.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  strClean = strClean.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  strClean = strClean.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  strClean = strClean.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  strClean = strClean.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  strClean = strClean.replace(/đ/g, 'd');
  strClean = strClean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return strClean.trim();
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number>(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(PRICE_RANGES[0]);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts([...prods].reverse());
  };

  useFocusEffect(
    useCallback(() => {
      initDatabase(() => loadData());
    }, [])
  );

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
    Alert.alert('Thành công 🎉', `Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // 9. Lọc Tìm kiếm thông minh theo tên sản phẩm HOẶC theo tên danh mục (Hỗ trợ tiếng Việt không dấu & có dấu)
  // 10. Lọc sản phẩm theo khoảng giá (minPrice <= price <= maxPrice)
  const filteredProducts = products.filter((p) => {
    const catName = categories.find((c) => c.id === p.categoryId)?.name || '';
    const queryClean = removeVietnameseTones(searchQuery);

    const prodNameClean = removeVietnameseTones(p.name);
    const catNameClean = removeVietnameseTones(catName);

    const matchesSearch =
      queryClean === '' ||
      prodNameClean.includes(queryClean) ||
      catNameClean.includes(queryClean);

    const matchesCat = selectedCatId === 0 || p.categoryId === selectedCatId;

    const matchesPrice =
      p.price >= selectedPriceRange.minPrice &&
      p.price <= selectedPriceRange.maxPrice;

    return matchesSearch && matchesCat && matchesPrice;
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardImageContainer}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={getImageSource(item.img)} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Text style={styles.detailBtnText}>Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addCartBtnText}>+ Giỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const categoryListForSelector: Category[] = [
    { id: 0, name: 'Tất cả' },
    ...categories,
  ];

  return (
    <View style={styles.mainContainer}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <Image
          source={{ uri: 'https://tse1.mm.bing.net/th/id/OIP.dEBloHhuDH7zFeUmfuAKaAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' }}
          style={styles.bannerImage}
        />

        {/* Menu điều hướng ngang: Home, Danh mục sản phẩm */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('ProductsByCategory', { categoryId: 1 })
            }
          >
            <Text style={styles.menuText}>Danh mục sản phẩm</Text>
          </TouchableOpacity>
        </View>

        {/* 9. Ô Tìm kiếm theo tên sản phẩm HOẶC danh mục */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên sản phẩm hoặc tên danh mục..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>❌</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lọc Danh mục sản phẩm Chip Selector */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
        </View>
        <CategorySelector
          categories={categoryListForSelector}
          selectedId={selectedCatId}
          onSelect={(id) => {
            setSelectedCatId(id);
            if (id !== 0) {
              navigation.navigate('ProductsByCategory', { categoryId: id });
            }
          }}
        />

        {/* 10. Lọc sản phẩm theo khoảng giá Chip Selector */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lọc theo khoảng giá</Text>
        </View>
        <PriceRangeSelector
          selectedRangeId={selectedPriceRange.id}
          onSelectRange={(range) => setSelectedPriceRange(range)}
        />

        {/* Danh sách sản phẩm dạng Lưới */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
          <Text style={styles.itemCount}>({filteredProducts.length} sản phẩm)</Text>
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.productGrid}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp!</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 30 },
  bannerImage: { width: '100%', height: 130, resizeMode: 'cover' },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#E8EAF6',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 4 },
  menuText: { fontSize: 14, fontWeight: 'bold', color: '#3F51B5' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 42, color: '#212121', fontSize: 14 },
  clearSearch: { fontSize: 14, color: '#888' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  itemCount: { fontSize: 13, color: '#757575', marginLeft: 8 },
  productGrid: { paddingHorizontal: 10 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: { backgroundColor: '#F5F5F5', alignItems: 'center', padding: 8 },
  image: { width: '100%', height: 110, resizeMode: 'contain' },
  cardBody: { padding: 10 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#212121', minHeight: 38 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#E53935', marginVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 6 },
  detailBtn: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailBtnText: { color: '#495057', fontSize: 12, fontWeight: 'bold' },
  addCartBtn: {
    flex: 1,
    backgroundColor: '#6200EA',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  addCartBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  emptyView: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#757575', fontSize: 15 },
});

export default HomeScreen;
