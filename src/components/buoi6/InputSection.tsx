import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface InputSectionProps {
  height: string;
  setHeight: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export default function InputSection({
  height,
  setHeight,
  weight,
  setWeight,
  onCalculate,
  onReset,
}: InputSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chiều cao (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ví dụ: 170"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Cân nặng (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ví dụ: 65"
        value={weight}
        onChangeText={setWeight}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calcButton} onPress={onCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    flex: 0.65,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
    padding: 15,
    borderRadius: 8,
    flex: 0.3,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});