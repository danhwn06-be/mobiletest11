import React, { useState, useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from './Header';
import { Product, initDatabase, fetchProducts } from './database';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
  Categories: undefined;
  AdminDashboard: undefined;
};

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const getImageSource = (img: string) => {
  if (img && img.startsWith('file://')) {
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

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initDatabase(() => {
      loadData();
    });
  }, []);

  const loadData = async () => {
    const prods = await fetchProducts();
    setProducts(prods.reverse());
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={getImageSource(item.img)} style={styles.image} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Text style={styles.buyButtonText}>Mua Ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/book_images/banner.png')}
        style={styles.banner}
      />
      <Header />
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
      <Text style={styles.welcomeText}>
        Chào mừng đến với cửa hàng thời trang ABC!
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Không có sản phẩm nào
          </Text>
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  banner: { width: '100%', height: 100, resizeMode: 'cover' },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },
  menuItem: { padding: 10 },
  menuText: { fontSize: 16, fontWeight: 'bold' },
  welcomeText: { textAlign: 'center', fontSize: 18, marginTop: 15, marginBottom: 10, fontWeight: '500' },
  image: { width: 110, height: 80, resizeMode: 'contain' },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#E91E63',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
