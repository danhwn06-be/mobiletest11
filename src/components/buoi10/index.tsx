import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Header from './Header';
import ProductItem from './ProductItem';
import Footer from './Footer';
import { PRODUCTS_DATA } from './data';
import { Product } from './types';

const Buoi10 = () => {
  const renderItem = ({ item }: { item: Product }) => (
    <ProductItem product={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <FlatList
        data={PRODUCTS_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={
          <>
            <Header />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>🔥 DANH SÁCH SẢN PHẨM</Text>
            </View>
          </>
        }
        ListFooterComponent={<Footer />}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContainer: {
    paddingBottom: 10,
  },
  sectionTitleContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  columnWrapper: {
    justify: 'space-between',
    paddingHorizontal: 6,
  },
});

export default Buoi10;
