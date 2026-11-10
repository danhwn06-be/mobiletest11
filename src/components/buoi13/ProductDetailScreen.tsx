import React, { useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, Category, fetchCategories } from './database';
import CategorySelector from './CategorySelector';
import { HomeStackParamList } from './HomeScreen';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductsByCategory'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { product } = route.params;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    load();
  }, []);

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

  const handleSelectCategory = (id: number) => {
    const selected = categories.find((c) => c.id === id);
    if (selected) {
      console.log('Selected category:', selected);
      navigation.navigate('ProductsByCategory', {
        categoryId: selected.id,
        categoryName: selected.name,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={getImageSource(product.img)} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      <Text style={styles.label}>Xem các sản phẩm khác:</Text>
      <CategorySelector
        categories={categories}
        selectedId={product.categoryId}
        onSelect={handleSelectCategory}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  name: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: '#E91E63', fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
});

export default ProductDetailScreen;
