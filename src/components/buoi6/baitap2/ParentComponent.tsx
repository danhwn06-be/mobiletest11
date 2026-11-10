import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import ChildComponent from './ChildComponent';

export default function ParentComponent() {
  // 1. Quản lý toàn bộ trạng thái (State) chính tại Component Cha
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [colorResult, setColorResult] = useState<string>('');
  const [idealWeight, setIdealWeight] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');

  // Đơn vị đo lường (cm/m, kg/lb)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  const handleHeightUnitChange = (unit: 'cm' | 'm') => {
    setHeightUnit(unit);
    setHeight('');
    clearResult();
  };

  const handleWeightUnitChange = (unit: 'kg' | 'lb') => {
    setWeightUnit(unit);
    setWeight('');
    clearResult();
  };

  const clearResult = () => {
    setBmiResult('');
    setCategory('');
    setColorResult('');
    setIdealWeight('');
    setAdvice('');
  };

  // 2. Hàm thuật toán tính toán BMI và phân loại theo tiêu chuẩn WHO
  const calculateBMI = () => {
    Keyboard.dismiss();

    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập chiều cao và cân nặng hợp lệ!');
      return;
    }

    // Quy đổi về hệ chuẩn mét (m) và kilogram (kg) để tính toán
    let weightInKg = w;
    if (weightUnit === 'lb') {
      weightInKg = w * 0.453592;
    }

    let heightInM = h;
    if (heightUnit === 'cm') {
      heightInM = h / 100;
    } else if (heightUnit === 'm') {
      heightInM = h;
    }

    // Thuật toán tính chỉ số BMI = kg / (m * m)
    const bmi = weightInKg / (heightInM * heightInM);
    const bmiValueStr = bmi.toFixed(1);

    // Tính khoảng cân nặng lý tưởng theo WHO (BMI từ 18.5 đến 24.9)
    const minIdealWeightKg = 18.5 * heightInM * heightInM;
    const maxIdealWeightKg = 24.9 * heightInM * heightInM;

    let minWeightStr = '';
    let maxWeightStr = '';

    if (weightUnit === 'kg') {
      minWeightStr = minIdealWeightKg.toFixed(1) + ' kg';
      maxWeightStr = maxIdealWeightKg.toFixed(1) + ' kg';
    } else {
      const minIdealWeightLb = minIdealWeightKg / 0.453592;
      const maxIdealWeightLb = maxIdealWeightKg / 0.453592;
      minWeightStr = minIdealWeightLb.toFixed(1) + ' lb';
      maxWeightStr = maxIdealWeightLb.toFixed(1) + ' lb';
    }

    const idealStr = `${minWeightStr} - ${maxWeightStr}`;

    // Phân loại sức khỏe theo tiêu chuẩn WHO
    let cat = '';
    let col = '';
    let adv = '';
    const numericBMI = parseFloat(bmiValueStr);

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

    // Cập nhật State kết quả tại Component Cha
    setBmiResult(bmiValueStr);
    setCategory(cat);
    setColorResult(col);
    setIdealWeight(idealStr);
    setAdvice(adv);
  };

  // Hàm Xóa / Reset
  const resetForm = () => {
    setWeight('');
    setHeight('');
    clearResult();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>

      {/* 3. Truyền dữ liệu (Props) và các hàm callback xuống Component Con */}
      <ChildComponent
        heightUnit={heightUnit}
        weightUnit={weightUnit}
        onHeightUnitChange={handleHeightUnitChange}
        onWeightUnitChange={handleWeightUnitChange}
        height={height}
        onChangeHeight={setHeight}
        weight={weight}
        onChangeWeight={setWeight}
        onCalculate={calculateBMI}
        onReset={resetForm}
      />

      {/* Gộp phần hiển thị kết quả vào trực tiếp Parent để đảm bảo Yêu cầu: CHỈ CÓ 2 COMPONENTS */}
      {bmiResult !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Chỉ số BMI của bạn</Text>
          <Text style={[styles.bmiValue, { color: colorResult }]}>{bmiResult}</Text>
          <Text style={[styles.categoryValue, { color: colorResult }]}>{category}</Text>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceTitle}>Cân nặng lý tưởng:</Text>
            <Text style={styles.adviceText}>{idealWeight}</Text>

            <Text style={styles.adviceTitle}>Lời khuyên:</Text>
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
        </View>
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
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  bmiValue: {
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categoryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  adviceBox: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#EEE',
    paddingTop: 15,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  adviceText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
});