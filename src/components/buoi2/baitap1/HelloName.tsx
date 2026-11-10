import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelloName = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Nguyễn Văn A</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HelloName;
