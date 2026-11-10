import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

type Props = {
  nameProp: string;
  ageProp: string;
  triggerUpdate: number;
  onSendData: (name: string, age: string) => void;
};

const ChildComponent = ({ nameProp, ageProp, triggerUpdate, onSendData }: Props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setName(nameProp);
    setAge(ageProp);
  }, [nameProp, ageProp, triggerUpdate]);

  const validateData = (n: string, a: string) => {
    if (n.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên hợp lệ.');
      return false;
    }
    const parsedAge = parseInt(a, 10);
    if (a.trim() === '' || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 150) {
      Alert.alert('Lỗi', 'Vui lòng nhập tuổi hợp lệ (từ 1 đến 150).');
      return false;
    }
    return true;
  };

  const onShow = () => {
    if (!validateData(name, age)) return;
    Alert.alert('Thông tin (Con)', `Tên: ${name}\nTuổi: ${age}`);
  };

  const onClear = () => {
    setName('');
    setAge('');
    inputRef.current?.focus();
  };

  const handleSendToParent = () => {
    if (!validateData(name, age)) return;
    onSendData(name, age);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Component</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Nhập tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <View style={styles.buttonRow}>
        <Button title="Hiển thị" onPress={onShow} />
        <Button title="Xóa" onPress={onClear} color="red" />
        <Button title="Truyền Cha" onPress={handleSendToParent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  }
});

export default ChildComponent;
