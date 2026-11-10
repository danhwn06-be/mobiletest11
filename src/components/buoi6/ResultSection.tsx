import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultSectionProps {
  bmi: string;
  category: string;
  color: string;
  idealWeight: string;
  advice: string;
}

export default function ResultSection({
  bmi,
  category,
  color,
  idealWeight,
  advice,
}: ResultSectionProps) {
  if (!bmi) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉ số BMI của bạn</Text>
      <Text style={[styles.bmiValue, { color: color }]}>{bmi}</Text>
      <Text style={[styles.category, { color: color }]}>{category}</Text>

      <View style={styles.adviceBox}>
        <Text style={styles.adviceTitle}>Cân nặng lý tưởng:</Text>
        <Text style={styles.adviceText}>{idealWeight}</Text>

        <Text style={styles.adviceTitle}>Lời khuyên:</Text>
        <Text style={styles.adviceText}>{advice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  bmiValue: {
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  category: {
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