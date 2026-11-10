import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

export interface PriceRange {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: 'all', label: 'Tất cả giá', minPrice: 0, maxPrice: Infinity },
  { id: 'under300k', label: 'Dưới 300k', minPrice: 0, maxPrice: 300000 },
  { id: '300k-700k', label: '300k - 700k', minPrice: 300000, maxPrice: 700000 },
  { id: 'above700k', label: 'Trên 700k', minPrice: 700000, maxPrice: Infinity },
];

interface Props {
  selectedRangeId: string;
  onSelectRange: (range: PriceRange) => void;
}

const PriceRangeSelector = ({ selectedRangeId, onSelectRange }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PRICE_RANGES.map((range) => {
        const isSelected = range.id === selectedRangeId;
        return (
          <TouchableOpacity
            key={range.id}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelectRange(range)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              💰 {range.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 6,
  },
  selectedChip: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
    elevation: 2,
  },
  text: {
    color: '#495057',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default PriceRangeSelector;
