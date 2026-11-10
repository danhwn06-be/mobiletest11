import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Category } from './database';

interface Props {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const CategorySelector = ({ categories, selectedId, onSelect }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 6,
  },
  selectedChip: {
    backgroundColor: '#6200EA',
    borderColor: '#6200EA',
    elevation: 2,
    shadowColor: '#6200EA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default CategorySelector;
