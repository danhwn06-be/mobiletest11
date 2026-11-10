import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Khai báo kiểu dữ liệu Học Sinh
export interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

export type FilterType = 'ALL' | 'AGE_ABOVE_18' | 'GRADE_ABOVE_8';
export type SortField = 'NONE' | 'GRADE_DESC' | 'GRADE_ASC' | 'AGE_DESC' | 'AGE_ASC';

// 1. Mảng học sinh mẫu ban đầu (ít nhất 5 học sinh)
const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: 'Nguyễn Văn An', age: 19, grade: 8.5 },
  { id: 2, name: 'Trần Thị Bình', age: 17, grade: 7.2 },
  { id: 3, name: 'Lê Hoàng Cường', age: 20, grade: 9.1 },
  { id: 4, name: 'Phạm Minh Đức', age: 18, grade: 6.5 },
  { id: 5, name: 'Hoàng Thu Thảo', age: 21, grade: 8.8 },
  { id: 6, name: 'Đặng Quốc Anh', age: 16, grade: 5.0 },
];

export default function StudentManager() {
  // Quản lý state danh sách học sinh
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // States cho Form Thêm/Sửa
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('');
  const [gradeInput, setGradeInput] = useState<string>('');

  // States cho Lọc & Tìm kiếm
  const [searchName, setSearchName] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('ALL');

  // States cho Sắp xếp
  const [sortField, setSortField] = useState<SortField>('GRADE_DESC');

  // ==========================================
  // 1 & 2. THÊM / SỬA HỌC SINH
  // ==========================================
  const handleSaveStudent = () => {
    if (!nameInput.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tên học sinh!');
      return;
    }

    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tuổi hợp lệ (số nguyên dương)!');
      return;
    }

    const gradeNum = parseFloat(gradeInput);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập điểm hợp lệ (từ 0 đến 10)!');
      return;
    }

    if (editingId !== null) {
      // 2. Sửa thông tin học sinh dựa trên ID (sử dụng array.map)
      setStudents(prev =>
        prev.map(st =>
          st.id === editingId
            ? { ...st, name: nameInput.trim(), age: ageNum, grade: gradeNum }
            : st
        )
      );
      Alert.alert('Thành công', `Cập nhật học sinh ID #${editingId} thành công!`);
      resetForm();
    } else {
      // 1. Thêm học sinh mới vào danh sách (sử dụng array spread)
      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const newStudent: Student = {
        id: newId,
        name: nameInput.trim(),
        age: ageNum,
        grade: gradeNum,
      };
      setStudents(prev => [...prev, newStudent]);
      Alert.alert('Thành công', `Đã thêm học sinh "${newStudent.name}" vào danh sách!`);
      resetForm();
    }
  };

  const handleEditPress = (student: Student) => {
    setEditingId(student.id);
    setNameInput(student.name);
    setAgeInput(student.age.toString());
    setGradeInput(student.grade.toString());
  };

  const resetForm = () => {
    setEditingId(null);
    setNameInput('');
    setAgeInput('');
    setGradeInput('');
  };

  // ==========================================
  // 3. XÓA HỌC SINH BẰNG ID
  // ==========================================
  const handleDeleteStudent = (id: number, name: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa học sinh "${name}" (ID: #${id})?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // Sử dụng array.filter để xóa học sinh khỏi mảng
            setStudents(prev => prev.filter(s => s.id !== id));
            if (editingId === id) {
              resetForm();
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // 6. TÍNH TOÁN SỐ LƯỢNG HỌC SINH THỎA MÃN ĐIỀU KIỆN
  // ==========================================
  // Tính số lượng học sinh điểm > 8 (dùng reduce)
  const countGradeAbove8 = useMemo(() => {
    return students.reduce((acc, st) => (st.grade > 8 ? acc + 1 : acc), 0);
  }, [students]);

  // Tính số lượng học sinh tuổi > 18 (dùng filter)
  const countAgeAbove18 = useMemo(() => {
    return students.filter(st => st.age > 18).length;
  }, [students]);

  // Điểm trung bình cả lớp
  const averageGrade = useMemo(() => {
    if (students.length === 0) return '0.0';
    const sum = students.reduce((acc, st) => acc + st.grade, 0);
    return (sum / students.length).toFixed(1);
  }, [students]);

  // ==========================================
  // 4 & 5. LỌC VÀ SẮP XẾP DANH SÁCH
  // ==========================================
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 4. Lọc theo tên học sinh
    if (searchName.trim()) {
      const searchLower = searchName.trim().toLowerCase();
      result = result.filter(st => st.name.toLowerCase().includes(searchLower));
    }

    // 4. Lọc theo độ tuổi (>18) hoặc điểm số (>8)
    if (filterType === 'AGE_ABOVE_18') {
      result = result.filter(st => st.age > 18);
    } else if (filterType === 'GRADE_ABOVE_8') {
      result = result.filter(st => st.grade > 8);
    }

    // 5. Sắp xếp danh sách theo điểm số hoặc tuổi (dùng array.sort)
    if (sortField === 'GRADE_DESC') {
      result.sort((a, b) => b.grade - a.grade); // Điểm cao -> thấp
    } else if (sortField === 'GRADE_ASC') {
      result.sort((a, b) => a.grade - b.grade); // Điểm thấp -> cao
    } else if (sortField === 'AGE_DESC') {
      result.sort((a, b) => b.age - a.age); // Tuổi lớn -> nhỏ
    } else if (sortField === 'AGE_ASC') {
      result.sort((a, b) => a.age - b.age); // Tuổi nhỏ -> lớn
    }

    return result;
  }, [students, searchName, filterType, sortField]);

  const getGradeBadgeStyle = (grade: number) => {
    if (grade >= 8.0) return styles.badgeGiỏi;
    if (grade >= 6.5) return styles.badgeKhá;
    return styles.badgeTrungBinh;
  };

  const getGradeText = (grade: number) => {
    if (grade >= 8.0) return 'Giỏi';
    if (grade >= 6.5) return 'Khá';
    return 'Trung Bình';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={processedStudents}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <Text style={styles.headerTitle}>📚 Quản Lý Học Sinh (Buổi 7)</Text>

              {/* KHU VỰC THỐNG KÊ */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{students.length}</Text>
                  <Text style={styles.statLabel}>Tổng số học sinh</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={[styles.statNumber, { color: '#2E7D32' }]}>
                    {countGradeAbove8}
                  </Text>
                  <Text style={styles.statLabel}>Điểm &gt; 8.0 (Giỏi)</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={[styles.statNumber, { color: '#1976D2' }]}>
                    {countAgeAbove18}
                  </Text>
                  <Text style={styles.statLabel}>Tuổi &gt; 18</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={[styles.statNumber, { color: '#E65100' }]}>
                    {averageGrade}
                  </Text>
                  <Text style={styles.statLabel}>Điểm trung bình</Text>
                </View>
              </View>

              {/* FORM THÊM / SỬA HỌC SINH */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {editingId !== null ? `✏️ Sửa Học Sinh (ID: #${editingId})` : '➕ Thêm Học Sinh Mới'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Tên học sinh (ví dụ: Nguyễn Văn A)"
                  value={nameInput}
                  onChangeText={setNameInput}
                />

                <View style={styles.rowInputs}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Tuổi (ví dụ: 19)"
                    keyboardType="numeric"
                    value={ageInput}
                    onChangeText={setAgeInput}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Điểm (ví dụ: 8.5)"
                    keyboardType="numeric"
                    value={gradeInput}
                    onChangeText={setGradeInput}
                  />
                </View>

                <View style={styles.formActionButtons}>
                  <TouchableOpacity style={styles.btnSave} onPress={handleSaveStudent}>
                    <Text style={styles.btnSaveText}>
                      {editingId !== null ? 'Lưu Cập Nhật' : 'Thêm Vào Danh Sách'}
                    </Text>
                  </TouchableOpacity>

                  {editingId !== null && (
                    <TouchableOpacity style={styles.btnCancel} onPress={resetForm}>
                      <Text style={styles.btnCancelText}>Hủy</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* KHU VỰC LỌC */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>🔍 Lọc & Tìm Kiếm Học Sinh</Text>

                <TextInput
                  style={styles.searchInput}
                  placeholder="🔎 Tìm kiếm theo tên học sinh..."
                  value={searchName}
                  onChangeText={setSearchName}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                  <TouchableOpacity
                    style={[styles.filterChip, filterType === 'ALL' && styles.filterChipActive]}
                    onPress={() => setFilterType('ALL')}
                  >
                    <Text style={[styles.filterChipText, filterType === 'ALL' && styles.filterChipTextActive]}>
                      Tất cả ({students.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, filterType === 'GRADE_ABOVE_8' && styles.filterChipActive]}
                    onPress={() => setFilterType('GRADE_ABOVE_8')}
                  >
                    <Text style={[styles.filterChipText, filterType === 'GRADE_ABOVE_8' && styles.filterChipTextActive]}>
                      Điểm &gt; 8.0 ({countGradeAbove8})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, filterType === 'AGE_ABOVE_18' && styles.filterChipActive]}
                    onPress={() => setFilterType('AGE_ABOVE_18')}
                  >
                    <Text style={[styles.filterChipText, filterType === 'AGE_ABOVE_18' && styles.filterChipTextActive]}>
                      Tuổi &gt; 18 ({countAgeAbove18})
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* KHU VỰC SẮP XẾP */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>⇅ Sắp Xếp Danh Sách</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                  <TouchableOpacity
                    style={[styles.sortChip, sortField === 'GRADE_DESC' && styles.sortChipActive]}
                    onPress={() => setSortField('GRADE_DESC')}
                  >
                    <Text style={[styles.sortChipText, sortField === 'GRADE_DESC' && styles.sortChipTextActive]}>
                      Điểm: Cao ➔ Thấp
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sortChip, sortField === 'GRADE_ASC' && styles.sortChipActive]}
                    onPress={() => setSortField('GRADE_ASC')}
                  >
                    <Text style={[styles.sortChipText, sortField === 'GRADE_ASC' && styles.sortChipTextActive]}>
                      Điểm: Thấp ➔ Cao
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sortChip, sortField === 'AGE_DESC' && styles.sortChipActive]}
                    onPress={() => setSortField('AGE_DESC')}
                  >
                    <Text style={[styles.sortChipText, sortField === 'AGE_DESC' && styles.sortChipTextActive]}>
                      Tuổi: Lớn ➔ Nhỏ
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sortChip, sortField === 'AGE_ASC' && styles.sortChipActive]}
                    onPress={() => setSortField('AGE_ASC')}
                  >
                    <Text style={[styles.sortChipText, sortField === 'AGE_ASC' && styles.sortChipTextActive]}>
                      Tuổi: Nhỏ ➔ Lớn
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <Text style={styles.listHeaderSummary}>
                Đang hiển thị: {processedStudents.length} học sinh
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentInfoLeft}>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>#{item.id}</Text>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentMeta}>
                    Tuổi: <Text style={styles.boldText}>{item.age}</Text> | Điểm: <Text style={styles.boldText}>{item.grade.toFixed(1)}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.studentRightSide}>
                <View style={[styles.gradeBadge, getGradeBadgeStyle(item.grade)]}>
                  <Text style={styles.gradeBadgeText}>{getGradeText(item.grade)}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.btnEdit}
                    onPress={() => handleEditPress(item)}
                  >
                    <Text style={styles.btnEditText}>Sửa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={() => handleDeleteStudent(item.id, item.name)}
                  >
                    <Text style={styles.btnDeleteText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>🚫 Không tìm thấy học sinh phù hợp</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 16,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  // Form
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 10,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  formActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  btnSave: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  btnCancel: {
    backgroundColor: '#64748B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnCancelText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  // Sections (Filter / Sort)
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
  },
  filterBar: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  sortChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  sortChipActive: {
    backgroundColor: '#059669',
  },
  sortChipText: {
    fontSize: 12,
    color: '#475569',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  listHeaderSummary: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 8,
    fontWeight: '500',
  },

  // Student Card Item
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  studentInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  idBadge: {
    backgroundColor: '#E2E8F0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  studentMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1E293B',
  },

  studentRightSide: {
    alignItems: 'flex-end',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeGiỏi: {
    backgroundColor: '#DCFCE7',
  },
  badgeKhá: {
    backgroundColor: '#E0F2FE',
  },
  badgeTrungBinh: {
    backgroundColor: '#FFEDD5',
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  actionButtons: {
    flexDirection: 'row',
  },
  btnEdit: {
    backgroundColor: '#EAB308',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  btnEditText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnDelete: {
    backgroundColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnDeleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
