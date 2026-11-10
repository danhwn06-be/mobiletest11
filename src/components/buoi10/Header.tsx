import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Top Bar với Logo */}
      <View style={styles.logoRow}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' }}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.logoTextContainer}>
          <Text style={styles.brandTitle}>TECH STORE</Text>
          <Text style={styles.brandSubtitle}>Ứng dụng bán hàng công nghệ</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&q=80' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>SIÊU KHUYẾN MÃI MÙA HÈ</Text>
          <Text style={styles.bannerSubtitle}>Giảm giá lên đến 50% cho tất cả sản phẩm</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  logoImage: {
    width: 42,
    height: 42,
    marginRight: 12,
  },
  logoTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  bannerContainer: {
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    color: '#fef08a',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Header;
