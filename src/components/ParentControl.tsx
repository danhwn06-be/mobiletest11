import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import LightControl from './LightControl';

const ParentControl = () => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [brightness, setBrightness] = useState(0);

  const birthMonth = 8;

  const handleToggleLight = () => {
    setIsLightOn((prev) => !prev);
  };

  const handleIncreaseBrightness = () => {
    if (!isLightOn) return; // Không cho tăng độ sáng khi đèn tắt

    setBrightness((prev) => {
      const newBrightness = prev + birthMonth;
      return newBrightness > 100 ? 100 : newBrightness; // Không cho lớn hơn 100
    });
  };

  const handleDecreaseBrightness = () => {
    if (!isLightOn) return; // Không cho giảm độ sáng khi đèn tắt

    setBrightness((prev) => {
      const newBrightness = prev - birthMonth;
      return newBrightness < 0 ? 0 : newBrightness; // Không cho nhỏ hơn 0
    });
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề ứng dụng và thông tin sinh viên */}
      <Text style={styles.appTitle}>HỆ THỐNG ĐIỀU KHIỂN ĐÈN THÔNG MINH</Text>
      <Text style={styles.studentInfo}>SVTH: Hồ Văn Đàn - Ngày sinh: 12/08/2006</Text>

      {/* KHU VỰC COMPONENT CHA */}
      <View style={styles.parentSection}>
        <Text style={styles.sectionTitle}>===== COMPONENT CHA =====</Text>
        <Text style={styles.text}>
          Trạng thái đèn:{' '}
          <Text style={{ color: isLightOn ? '#2E7D32' : '#D32F2F', fontWeight: 'bold' }}>
            {isLightOn ? 'Bật' : 'Tắt'}
          </Text>
        </Text>
        <Text style={styles.text}>Độ sáng hiện tại: {brightness}</Text>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title={isLightOn ? 'Tắt đèn' : 'Bật đèn'}
              onPress={handleToggleLight}
              color="#1976D2"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Tăng độ sáng"
              onPress={handleIncreaseBrightness}
              disabled={!isLightOn || brightness >= 100}
              color="#388E3C"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Giảm độ sáng"
              onPress={handleDecreaseBrightness}
              disabled={!isLightOn || brightness <= 0}
              color="#F57C00"
            />
          </View>
        </View>
      </View>

      {/* Truyền dữ liệu và callback xuống Component con */}
      <LightControl
        isLightOn={isLightOn}
        brightness={brightness}
        onToggle={handleToggleLight}
        onIncrease={handleIncreaseBrightness}
        onDecrease={handleDecreaseBrightness}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  studentInfo: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#555',
  },
  parentSection: {
    borderWidth: 2,
    borderColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1565C0',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 5,
  },
  buttonWrapper: {
    marginVertical: 4,
  },
});

export default ParentControl;