import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

const HelloState = () => {
  const [name, setName] = useState<string>('Nguyễn Văn A');
  const [age, setAge] = useState<number>(20);

  const handlePress = () => {
    Alert.alert('Thông báo', `Hello ${name}, ${age} tuổi`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name}</Text>
      <Button title="Hiển thị chi tiết" onPress={handlePress} />
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
    fontSize: 22,
    marginBottom: 20,
  },
});

export default HelloState;
