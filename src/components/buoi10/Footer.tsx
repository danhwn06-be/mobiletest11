import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>THÔNG TIN THÀNH VIÊN</Text>
      <View style={styles.columnsWrapper}>
        {/* Cột 1 */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Cột 1</Text>
          <Text style={styles.label}>Họ & Tên:</Text>
          <Text style={styles.value}>Hồ Văn Đàn</Text>
          <Text style={styles.label}>MSSV:</Text>
          <Text style={styles.value}>24PNV05</Text>
        </View>

        {/* Cột 2 */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Cột 2</Text>
          <Text style={styles.label}>Lớp:</Text>
          <Text style={styles.value}>24PNV1A</Text>
          <Text style={styles.label}>Chuyên ngành:</Text>
          <Text style={styles.value}>Lập trình Mobile</Text>
        </View>

        {/* Cột 3 */}
        <View style={styles.columnLast}>
          <Text style={styles.columnHeader}>Cột 3</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>st.anhdan09@gmail.com</Text>
          <Text style={styles.label}>Điện thoại:</Text>
          <Text style={styles.value}>0386.524.061</Text>
        </View>
      </View>
      <View style={styles.copyrightRow}>
        <Text style={styles.copyrightText}>© 2026 Mobile App Sales. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 20,
    backgroundColor: '#0f172a',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footerTitle: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  columnsWrapper: {
    flexDirection: 'row',
    justify: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  columnLast: {
    flex: 1,
    paddingHorizontal: 6,
  },
  columnHeader: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  label: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  value: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  copyrightRow: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  copyrightText: {
    color: '#64748b',
    fontSize: 11,
  },
});

export default Footer;
