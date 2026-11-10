import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeScreen';
import { Product, Category, fetchCategories, fetchProductsByCategory } from './database';
import CategorySelector from './CategorySelector';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductsByCategory'>;
type RouteProps = RouteProp<HomeStackParamList, 'ProductsByCategory'>;

export default function ProductsByCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryId } = route.params || { categoryId: 1 };
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetchProductsByCategory(selectedCategoryId).then(setProducts);
  }, [selectedCategoryId]);

  const getImageSource = (img: string) => {
    if (img && img.startsWith('file://')) return { uri: img };
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

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={(id) => setSelectedCategoryId(id)}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={getImageSource(item.img)} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Không có sản phẩm nào thuộc loại này
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fdfdfd',
  },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
  info: { justifyContent: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 },
  price: { color: '#E91E63', marginTop: 5 },
});
