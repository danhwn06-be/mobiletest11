import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

/**
 * Component LinearEquationSolver (Giải phương trình bậc nhất ax + b = 0)
 *
 * @description
 * - Cung cấp giao diện để người dùng nhập hệ số a và b.
 * - Có nút bấm "Giải phương trình" để tính toán nghiệm x.
 * - Xử lý logic chia cho 0 để chặn trường hợp vô nghiệm/vô số nghiệm.
 */
const LinearEquationSolver = () => {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [result, setResult] = useState<string>('');

  /**
   * Hàm xử lý logic giải phương trình ax + b = 0
   */
  const handleSolve = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      setResult('Vui lòng nhập hệ số a và b hợp lệ!');
      return;
    }

    if (numA === 0) {
      if (numB === 0) {
        setResult('Phương trình có vô số nghiệm (0x + 0 = 0)');
      } else {
        setResult('Phương trình vô nghiệm (0x + b = 0)');
      }
    } else {
      const x = -numB / numA;
      setResult(`Nghiệm của phương trình là: x = ${x}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc 1</Text>
      <Text style={styles.subtitle}>ax + b = 0</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số a"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số b"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />

      <Button title="Giải phương trình" onPress={handleSolve} />

      {result !== '' && (
        <Text style={styles.resultText}>{result}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LinearEquationSolver;
