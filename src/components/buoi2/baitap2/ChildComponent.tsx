import React, { useState, useRef, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  aProp: string;
  bProp: string;
  triggerUpdate: number;
  onSendData: (a: string, b: string, result: string) => void;
};

const ChildComponent = ({ aProp, bProp, triggerUpdate, onSendData }: Props) => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setA(aProp);
    setB(bProp);
  }, [aProp, bProp, triggerUpdate]);

  const onGiai = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      Alert.alert('Vui lòng nhập số hợp lệ cho hệ số A và B.');
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
      setResult(`Nghiệm của phương trình là:\n x = ${x.toFixed(2)}`);
    }
  };

  const onClear = () => {
    setA('');
    setB('');
    setResult('');
    inputRef.current?.focus();
  };

  // Xử lý khi nhấn nút "Truyền cha"
  const handleTruyenCha = () => {
    onSendData(a, b, result);
  };

  return (
    <View>
      <Text style={styles.headerText}>
        {aProp} và {bProp} nhận từ cha
      </Text>

      {/* Hiển thị kết quả giải phương trình */}
      {result !== '' && (
        <Text style={styles.resultText}>{result}</Text>
      )}

      <Text style={styles.titleText}>Child</Text>

      <TextInput
        style={styles.input}
        ref={inputRef}
        placeholder="Nhập hệ số A"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số B"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onGiai}>
          <Text style={styles.buttonText}>Giải pt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { width: '40%' }]} onPress={handleTruyenCha}>
          <Text style={styles.buttonText}>Truyền cha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChildComponent;

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'blue',
    marginBottom: 10,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    margin: 2,
    borderRadius: 5,
    backgroundColor: '#f3c5c5da',
    color: '#0e0d0d',
    fontSize: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00daf2',
    width: '25%',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
