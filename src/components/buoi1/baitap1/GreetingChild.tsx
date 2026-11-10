import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

export const GreetingChild = ({ name, age }: { name: string; age: number }) => {
  const handlePress = () => {
    Alert.alert('Thông báo', `Hello ${name}`);
  };

  return (
    <View style={styles.childContainer}>
      <Text style={styles.text}>Hello {name}, {age} tuổi</Text>

      <View>
        <Button
          title="Nhấn vào đây"
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  childContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
