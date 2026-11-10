import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface ChildComponentProps {
  heightUnit: 'cm' | 'm';
  weightUnit: 'kg' | 'lb';
  onHeightUnitChange: (unit: 'cm' | 'm') => void;
  onWeightUnitChange: (unit: 'kg' | 'lb') => void;
  height: string;
  onChangeHeight: (value: string) => void;
  weight: string;
  onChangeWeight: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export default function ChildComponent({
  heightUnit,
  weightUnit,
  onHeightUnitChange,
  onWeightUnitChange,
  height,
  onChangeHeight,
  weight,
  onChangeWeight,
  onCalculate,
  onReset,
}: ChildComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chiều cao ({heightUnit}):</Text>
      <View style={styles.inputWithToggleContainer}>
        <TextInput
          style={styles.inputWithToggle}
          keyboardType="numeric"
          placeholder={heightUnit === 'cm' ? 'Ví dụ: 170' : 'Ví dụ: 1.7'}
          value={height}
          onChangeText={onChangeHeight}
        />
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, heightUnit === 'cm' && styles.activeToggle]}
            onPress={() => onHeightUnitChange('cm')}
          >
            <Text style={[styles.toggleText, heightUnit === 'cm' && styles.activeToggleText]}>cm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, heightUnit === 'm' && styles.activeToggle]}
            onPress={() => onHeightUnitChange('m')}
          >
            <Text style={[styles.toggleText, heightUnit === 'm' && styles.activeToggleText]}>m</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Cân nặng ({weightUnit}):</Text>
      <View style={styles.inputWithToggleContainer}>
        <TextInput
          style={styles.inputWithToggle}
          keyboardType="numeric"
          placeholder={weightUnit === 'kg' ? 'Ví dụ: 65' : 'Ví dụ: 143'}
          value={weight}
          onChangeText={onChangeWeight}
        />
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, weightUnit === 'kg' && styles.activeToggle]}
            onPress={() => onWeightUnitChange('kg')}
          >
            <Text style={[styles.toggleText, weightUnit === 'kg' && styles.activeToggleText]}>kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, weightUnit === 'lb' && styles.activeToggle]}
            onPress={() => onWeightUnitChange('lb')}
          >
            <Text style={[styles.toggleText, weightUnit === 'lb' && styles.activeToggleText]}>lb</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  inputWithToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputWithToggle: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 12,
    fontSize: 18,
    height: 50,
  },
  toggleGroup: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  toggleButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#2196F3',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#FFF',
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