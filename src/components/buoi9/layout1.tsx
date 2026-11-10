import { Image, Text, View } from 'react-native';
import React from 'react';

const Layout1 = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Red Row */}
      <View style={{ flex: 1, backgroundColor: 'red', flexDirection: 'row' }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../../assests/orkut.png')} style={{ width: 50, height: 50 }} />
        </View>
        <View style={{ flex: 5, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Right</Text>
        </View>
      </View>

      {/* Blue Row */}
      <View style={{ flex: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Content</Text>
      </View>

      {/* Green Row */}
      <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Left</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Center</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Right</Text>
        </View>
      </View>
    </View>
  );
};

export default Layout1;