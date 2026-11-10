import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const [inputName, setInputName] = useState('');
  const [inputAge, setInputAge] = useState('');

  const inputNameRef = useRef<TextInput>(null);

  const [parentName, setParentName] = useState('');
  const [parentAge, setParentAge] = useState('');

  const [triggerUpdate, setTriggerUpdate] = useState(0);

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

  const onShowParent = () => {
    if (!validateData(inputName, inputAge)) return;
    Alert.alert('Thông tin (Cha)', `Tên: ${inputName}\nTuổi: ${inputAge}`);
  };

  const onClearParent = () => {
    setInputName('');
    setInputAge('');
    inputNameRef.current?.focus();
  };

  const sendToChild = () => {
    if (!validateData(inputName, inputAge)) return;
    setParentName(inputName);
    setParentAge(inputAge);
    setTriggerUpdate(prev => prev + 1);
  };

  const receiveFromChild = (name: string, age: string) => {
    setInputName(name);
    setInputAge(age);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Component</Text>

      <TextInput
        ref={inputNameRef}
        style={styles.input}
        placeholder="Nhập tên"
        value={inputName}
        onChangeText={setInputName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        keyboardType="numeric"
        value={inputAge}
        onChangeText={setInputAge}
      />

      <View style={styles.buttonRow}>
        <Button title="Hiển thị" onPress={onShowParent} />
        <Button title="Xóa" onPress={onClearParent} color="red" />
        <Button title="Truyền Con" onPress={sendToChild} />
      </View>

      <ChildComponent
        nameProp={parentName}
        ageProp={parentAge}
        triggerUpdate={triggerUpdate}
        onSendData={receiveFromChild}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  }
});

export default ParentComponent;
