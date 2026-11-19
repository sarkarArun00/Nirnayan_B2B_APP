import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

const DOCUMENT_TYPES = [
  'Clinical History',
  'Prescription',
  'Lab Report',
  'Other',
];

const UploadClinicalHistory = ({visible, onClose, onUpload}) => {
  const [documentType, setDocumentType] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [clinicalHistory, setClinicalHistory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

//   const handleAddFiles = async () => {
//     try {
//       const files = await DocumentPicker.pick({
//         type: [
//           DocumentPicker.types.pdf,
//           DocumentPicker.types.images,
//           DocumentPicker.types.doc,
//           DocumentPicker.types.docx,
//         ],
//         allowMultiSelection: true,
//       });

//       setSelectedFiles(previous => {
//         const combined = [...previous, ...files];
//         return combined.filter(
//           (file, index, array) =>
//             index === array.findIndex(
//               item => item.uri === file.uri,
//             ),
//         );
//       });
//     } catch (error) {
//       if (!DocumentPicker.isCancel(error)) {
//         Alert.alert('Error', 'Unable to select files.');
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!documentType) {
//       Alert.alert('Required', 'Please select a document type.');
//       return;
//     }

//     if (selectedFiles.length === 0) {
//       Alert.alert('Required', 'Please add at least one file.');
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();

//       formData.append('documentType', documentType);
//       formData.append('clinicalHistory', clinicalHistory);

//       selectedFiles.forEach((file, index) => {
//         formData.append('files', {
//           uri: file.uri,
//           name: file.name || `clinical-history-${index + 1}`,
//           type: file.type || 'application/octet-stream',
//         });
//       });

//       // Connect your upload API through this callback.
//       if (onUpload) {
//         await onUpload(formData);
//       } else {
//         Alert.alert(
//           'Ready to upload',
//           'Connect the onUpload callback to your API.',
//         );
//         return;
//       }

//       setDocumentType('');
//       setClinicalHistory('');
//       setSelectedFiles([]);
//       onClose?.();
//     } catch (error) {
//       Alert.alert('Upload Failed', 'Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };
const handleAddFiles = () => {
  setSelectedFiles(previous => [
    ...previous,
    {
      uri: `demo-file-${Date.now()}`,
      name: `Clinical_History_${previous.length + 1}.pdf`,
      size: 245760,
      type: 'application/pdf',
    },
  ]);
};
const handleUpload = () => {
  if (!documentType) {
    Alert.alert('Required', 'Please select a document type.');
    return;
  }

  if (selectedFiles.length === 0) {
    Alert.alert('Required', 'Please add a file.');
    return;
  }

  Alert.alert(
    'Demo Successful',
    'Clinical history uploaded successfully (demo only).',
    [
      {
        text: 'OK',
        onPress: () => {
          setDocumentType('');
          setClinicalHistory('');
          setSelectedFiles([]);
          onClose?.();
        },
      },
    ],
  );
};
  const handleClose = () => {
    if (uploading) {
      return;
    }

    setDropdownVisible(false);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Upload Documents
            </Text>

            <TouchableOpacity
              onPress={handleClose}
              disabled={uploading}
              style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Add your documents to this record. Supported files
            can be uploaded below.
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>

            {/* Upload illustration */}
            <View style={styles.illustration}>
              <Text style={styles.cloudIcon}>☁</Text>
              <View style={styles.uploadArrow}>
                <Text style={styles.arrowText}>↑</Text>
              </View>
            </View>

            {/* Document type */}
            <Text style={styles.label}>Document Type</Text>

            <TouchableOpacity
              style={styles.dropdown}
              activeOpacity={0.8}
              onPress={() =>
                setDropdownVisible(!dropdownVisible)
              }>
              <Text
                style={[
                  styles.dropdownText,
                  !documentType && styles.placeholder,
                ]}>
                {documentType || 'Select'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {dropdownVisible ? '⌃' : '⌄'}
              </Text>
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={styles.dropdownOptions}>
                {DOCUMENT_TYPES.map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.option}
                    onPress={() => {
                      setDocumentType(item);
                      setDropdownVisible(false);
                    }}>
                    <Text style={styles.optionText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.helperText}>
              Only supported PDF, PNG, JPG and DOC files.
            </Text>

            {/* Clinical history */}
            <Text style={styles.label}>
              Clinical History
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Enter clinical history..."
              placeholderTextColor="#A0A0A0"
              multiline
              textAlignVertical="top"
              value={clinicalHistory}
              onChangeText={setClinicalHistory}
            />

            {/* Add files */}
            <TouchableOpacity
              style={styles.addFilesButton}
              onPress={handleAddFiles}
              disabled={uploading}
              activeOpacity={0.8}>
              <Text style={styles.addFilesText}>
                + Add Files
              </Text>
            </TouchableOpacity>

            {/* Selected files */}
            {selectedFiles.map((file, index) => (
              <View
                key={`${file.uri}-${index}`}
                style={styles.fileRow}>
                <View style={styles.fileInfo}>
                  <Text
                    style={styles.fileName}
                    numberOfLines={1}>
                    {file.name || 'Selected document'}
                  </Text>
                  <Text style={styles.fileSize}>
                    {file.size
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : 'File selected'}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={uploading}
                  onPress={() =>
                    setSelectedFiles(previous =>
                      previous.filter((_, i) => i !== index),
                    )
                  }>
                  <Text style={styles.removeFile}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Fixed bottom upload button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                uploading && styles.disabledButton,
              ]}
              onPress={handleUpload}
              disabled={uploading}
              activeOpacity={0.8}>
              {uploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.uploadText}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UploadClinicalHistory;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    maxHeight: '88%',
    minHeight: 400,
    paddingBottom: 12,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D5D5D5',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#171717',
    fontSize: 17,
    fontWeight: '700',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 27,
    color: '#666666',
  },
  subtitle: {
    fontSize: 11,
    color: '#858585',
    marginTop: 4,
    lineHeight: 16,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  illustration: {
    height: 105,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cloudIcon: {
    fontSize: 76,
    color: '#D9E3DE',
    lineHeight: 90,
  },
  uploadArrow: {
    position: 'absolute',
    top: 35,
    backgroundColor: '#00A85A',
    width: 32,
    height: 34,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 35,
  },
  label: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 7,
  },
  dropdown: {
    minHeight: 37,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 12,
    color: '#333333',
  },
  placeholder: {
    color: '#A0A0A0',
  },
  dropdownArrow: {
    color: '#555555',
    fontSize: 17,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    marginTop: 3,
    backgroundColor: '#FFFFFF',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 12,
    color: '#333333',
  },
  helperText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 5,
  },
  textArea: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
    color: '#333333',
  },
  addFilesButton: {
    height: 39,
    borderWidth: 1,
    borderColor: '#00B969',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addFilesText: {
    color: '#222222',
    fontSize: 12,
    fontWeight: '600',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F8F7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 7,
  },
  fileInfo: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 12,
    color: '#333333',
  },
  fileSize: {
    fontSize: 10,
    color: '#777777',
    marginTop: 3,
  },
  removeFile: {
    color: '#D93636',
    fontSize: 22,
    paddingHorizontal: 5,
  },
  footer: {
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  uploadButton: {
    height: 42,
    backgroundColor: '#00A85A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
