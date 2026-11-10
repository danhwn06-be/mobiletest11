import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

type Props = {
  isLightOn: boolean;
  brightness: number;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const LightControl = ({
  isLightOn,
  brightness,
  onToggle,
  onIncrease,
  onDecrease,
}: Props) => {

  const glowBackgroundColor = isLightOn
    ? `rgba(255, 235, 59, ${brightness / 100})`
    : 'transparent';

  return (
    <View style={styles.childSection}>
      <Text style={styles.sectionTitle}>===== COMPONENT CON =====</Text>

      <View style={styles.imageContainer}>
        <View style={[styles.glowWrapper, { backgroundColor: glowBackgroundColor }]}>
          <Image
            source={{
              uri: isLightOn
                ? 'https://cdn-icons-png.flaticon.com/512/427/427735.png'
                : 'https://cdn-icons-png.flaticon.com/128/2910/2910914.png',
            }}
            style={styles.bulbImage}
          />
        </View>
      </View>

      {/* Hiển thị dữ liệu nhận từ cha */}
      <Text style={styles.text}>
        Trạng thái nhận được:{' '}
        <Text style={{ color: isLightOn ? '#2E7D32' : '#D32F2F', fontWeight: 'bold' }}>
          {isLightOn ? 'Bật' : 'Tắt'}
        </Text>
      </Text>
      <Text style={styles.text}>Độ sáng nhận được: {brightness}</Text>

      {/* Các nút chức năng */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title={isLightOn ? 'Tắt đèn' : 'Bật đèn'}
            onPress={onToggle}
            color="#2196F3"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Tăng độ sáng"
            onPress={onIncrease}
            disabled={!isLightOn || brightness >= 100}
            color="#4CAF50"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Giảm độ sáng"
            onPress={onDecrease}
            disabled={!isLightOn || brightness <= 0}
            color="#FF9800"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  childSection: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2E7D32',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  glowWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bulbImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonWrapper: {
    marginVertical: 4,
  },
});

export default LightControl;