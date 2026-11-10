import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  // State cho ô nhập liệu của Cha
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [parentResult, setParentResult] = useState('');

  // State lưu giá trị để truyền xuống con
  const [parentA, setParentA] = useState('');
  const [parentB, setParentB] = useState('');

  // State để lưu dữ liệu nhận từ con
  const [dataFromChild, setDataFromChild] = useState({ a: '', b: '', result: '' });

  // Giải phương trình độc lập trên Cha
  const onGiaiParent = () => {
    const numA = parseFloat(inputA);
    const numB = parseFloat(inputB);

    if (isNaN(numA) || isNaN(numB)) {
      Alert.alert('Vui lòng nhập số hợp lệ cho hệ số A và B.');
      return;
    }

    if (numA === 0) {
      if (numB === 0) {
        setParentResult('Phương trình có vô số nghiệm.');
      } else {
        setParentResult('Phương trình vô nghiệm.');
      }
    } else {
      const x = -numB / numA;
      setParentResult(`Nghiệm của phương trình là:\n x = ${x.toFixed(2)}`);
    }
  };

  // Xóa dữ liệu độc lập trên Cha
  const onClearParent = () => {
    setInputA('');
    setInputB('');
    setParentResult('');
  };

  // Xử lý nút "Truyền con"
  const truyenXuongCon = () => {
    setParentA(inputA);
    setParentB(inputB);
  };

  // Hàm hứng dữ liệu từ con gửi lên
  const nhanDuLieuTuCon = (a: string, b: string, result: string) => {
    // Nếu con gửi lên dữ liệu rỗng (nghĩa là con vừa bị Xóa)
    // Cha sẽ lập tức xóa luôn dữ liệu của mình (để đồng bộ)
    // VÀ quan trọng nhất: xóa luôn parentA và parentB để bẻ gãy bộ nhớ cũ.
    if (a === '' && b === '') {
      setInputA('');
      setInputB('');
      setParentResult('');
      setParentA('');
      setParentB('');
      setDataFromChild({ a: '', b: '', result: '' });
      return;
    }

    setDataFromChild({ a, b, result });
    // Cập nhật luôn giá trị vào ô input của Cha
    setInputA(a);
    setInputB(b);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Parent Component</Text>

      {/* Hiển thị kết quả giải phương trình của Cha */}
      {parentResult !== '' && (
        <Text style={styles.resultText}>{parentResult}</Text>
      )}

      {/* Ô nhập liệu của Cha */}
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số A"
        keyboardType="numeric"
        value={inputA}
        onChangeText={setInputA}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số B"
        keyboardType="numeric"
        value={inputB}
        onChangeText={setInputB}
      />

      {/* Hàng nút bấm giống Child */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onGiaiParent}>
          <Text style={styles.btnText}>Giải pt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onClearParent}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { width: '40%' }]} onPress={truyenXuongCon}>
          <Text style={styles.btnText}>Truyền con</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.childWrapper}>
        <ChildComponent
          aProp={parentA}
          bProp={parentB}
          onSendData={nhanDuLieuTuCon}
        />
      </View>
    </View>
  );
};

export default ParentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'blue',
    marginBottom: 10,
  },
  input: {
    padding: 10,
    margin: 2,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f3c5c5da',
    color: '#0e0d0d',
    fontSize: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00daf2',
    width: '25%',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
  },
  infoResult: {
    fontSize: 16,
    color: 'blue',
  },
  childWrapper: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 8,
    flex: 1,
  },
});
