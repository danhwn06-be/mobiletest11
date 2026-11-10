import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GreetingChild } from './GreetingChild';


export const GreetingParent: React.FC = () => {
  const name = 'PNV';
  const age = 20;

  return (
    <View style={styles.parentContainer}>
      <GreetingChild name={name} age={age} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
