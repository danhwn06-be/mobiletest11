import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Product } from './types';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const handleBuyNow = () => {
    Alert.alert('Thông báo', `Bạn đã chọn mua: ${product.name}`);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatCurrency(product.price)}
        </Text>

        <TouchableOpacity style={styles.buyButton} activeOpacity={0.8} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#f8fafc',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    height: 38,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ProductItem;
