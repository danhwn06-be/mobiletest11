import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import InputSection from './InputSection';
import ResultSection from './ResultSection';

export interface BMIResult {
  bmi: string;
  category: string;
  color: string;
  idealWeight: string;
  advice: string;
}

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    Keyboard.dismiss();

    const w = parseFloat(weight);
    const hInCm = parseFloat(height);

    if (isNaN(w) || isNaN(hInCm) || w <= 0 || hInCm <= 0) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập chiều cao và cân nặng hợp lệ!');
      return;
    }

    const hInM = hInCm / 100;
    const bmiValue = (w / (hInM * hInM)).toFixed(1);

    const minWeight = (18.5 * hInM * hInM).toFixed(1);
    const maxWeight = (24.9 * hInM * hInM).toFixed(1);
    const idealStr = `${minWeight} kg - ${maxWeight} kg`;

    let cat = '';
    let col = '';
    let adv = '';
    const numericBMI = parseFloat(bmiValue);

    if (numericBMI < 18.5) {
      cat = 'Gầy (Underweight)';
      col = '#FFC107';
      adv = 'Bạn đang thiếu cân. Cần tăng cường ăn uống, bổ sung đạm và tinh bột kết hợp tập luyện nhẹ nhàng.';
    } else if (numericBMI >= 18.5 && numericBMI <= 24.9) {
      cat = 'Bình thường (Normal)';
      col = '#4CAF50';
      adv = 'Tuyệt vời! Hãy tiếp tục duy trì chế độ ăn uống và sinh hoạt hiện tại.';
    } else if (numericBMI >= 25 && numericBMI <= 29.9) {
      cat = 'Thừa cân (Overweight)';
      col = '#FF9800';
      adv = 'Bạn đang thừa cân. Hãy cắt giảm đồ ngọt, thức ăn nhanh và tập thể dục ít nhất 30 phút mỗi ngày.';
    } else {
      cat = 'Béo phì (Obese)';
      col = '#F44336';
      adv = 'Cảnh báo sức khỏe! Bạn cần có chế độ ăn kiêng nghiêm ngặt và tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng.';
    }

    setResult({
      bmi: bmiValue,
      category: cat,
      color: col,
      idealWeight: idealStr,
      advice: adv,
    });
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>

      <InputSection
        height={height}
        setHeight={setHeight}
        weight={weight}
        setWeight={setWeight}
        onCalculate={calculateBMI}
        onReset={resetForm}
      />

      {result && (
        <ResultSection
          bmi={result.bmi}
          category={result.category}
          color={result.color}
          idealWeight={result.idealWeight}
          advice={result.advice}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
});