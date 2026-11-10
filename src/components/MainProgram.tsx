import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default function MainProgram() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  const inputARef = useRef(null);

  const handleSolve = () => {
    Keyboard.dismiss();
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      setResult('Vui lòng nhập số hợp lệ cho cả a và b.');
      return;
    }

    if (numA === 0) {
      if (numB === 0) {
        setResult('Phương trình có vô số nghiệm.');
      } else {
        setResult('Phương trình vô nghiệm.');
      }
    } else {
      const x = -numB / numA;
      setResult(`Nghiệm x = ${x.toFixed(2)}`);
    }
  };

  const handleClear = () => {
    setA('');
    setB('');
    setResult('');
    // Đặt focus lại vào ô nhập a
    inputARef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>GIẢI PHƯƠNG TRÌNH ax + b = 0</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hệ số a:</Text>
          <TextInput
            ref={inputARef}
            style={styles.input}
            placeholder="Nhập a"
            keyboardType="numeric"
            value={a}
            onChangeText={setA}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hệ số b:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập b"
            keyboardType="numeric"
            value={b}
            onChangeText={setB}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.btnSolve]} onPress={handleSolve}>
            <Text style={styles.buttonText}>Giải</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.btnClear]} onPress={handleClear}>
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </View>

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Kết quả:</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1e293b',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSolve: {
    backgroundColor: '#2563eb',
  },
  btnClear: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});