import React, { useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as Progress from "react-native-progress";

// Max file size 5 MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function CreateDocuments({ navigation }) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [uploadDocModal, setUploadDocModal] = useState(false);
  const [uploadingProgressVisible, setUploadingProgressVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); // 0..1
  const uploadIntervalRef = useRef(null);

  // --------- Helpers for simulated upload progress ---------
  const startProgressSimulation = () => {
    // reset
    setUploadProgress(0);
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }

    // small delay before progress tick to ensure modal is visible
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + Math.random() * 0.08; // increment by small random amount
        if (next >= 1) {
          clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
          // keep modal visible a fraction longer then auto-close (optional)
          setTimeout(() => {
            setUploadingProgressVisible(false);
            setUploadProgress(0);
          }, 700);
          return 1;
        }
        return next;
      });
    }, 400);
  };

  const stopProgressSimulation = () => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
    setUploadProgress(0);
    setUploadingProgressVisible(false);
  };

  // ------------------ CAMERA UPLOAD ------------------
  const handleCameraUpload = () => {
    setUploadDocModal(false);
    setUploadingProgressVisible(true);

    const options = {
      mediaType: "photo",
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.error) {
        setUploadingProgressVisible(false);
        return;
      } else if (response.assets?.length > 0) {
        const photo = response.assets[0];

        if (photo.fileSize > MAX_FILE_SIZE_BYTES) {
          Alert.alert("File too large", "File size exceeds the 5MB limit.");
          setUploadingProgressVisible(false);
          return;
        }

        // Add to uploaded files and start progress simulation
        setUploadedFiles((prev) => [...prev, photo]);
        // start simulated progress (so modal isn't static)
        startProgressSimulation();
      }
    });
  };

  // ------------------ GALLERY / FILE UPLOAD ------------------
  const handleGalleryOrFileUpload = async () => {
    setUploadDocModal(false);
    setUploadingProgressVisible(true);

    const options = {
      mediaType: "mixed",
      quality: 0.8,
      selectionLimit: 0, // allow multiple
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel || response.error) {
        setUploadingProgressVisible(false);
        return;
      }

      if (response.assets) {
        const validFiles = response.assets.filter((file) => {
          if (file.fileSize > MAX_FILE_SIZE_BYTES) {
            Alert.alert("File skipped", `${file.fileName || file.uri} exceeds 5MB.`);
            return false;
          }
          return true;
        });

        if (validFiles.length > 0) {
          setUploadedFiles((prev) => [...prev, ...validFiles]);
          // start simulated progress
          startProgressSimulation();
        } else {
          // none valid -> hide modal
          setUploadingProgressVisible(false);
          Alert.alert("No files uploaded", "Ensure files are under 5MB.");
        }
      } else {
        setUploadingProgressVisible(false);
      }
    } catch (err) {
      console.error("File selection error:", err);
      setUploadingProgressVisible(false);
    }
  };

  // Cleanup on unmount just in case
  React.useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
    };
  }, []);

  // ------------------ UPLOADING PROGRESS MODAL (render inline) ------------------
  const UploadingProgressView = (
    <Modal
      transparent
      visible={uploadingProgressVisible}
      animationType="fade"
      onRequestClose={() => {
        // Android back button behaviour
        // We'll stop upload simulation if user requests close
        stopProgressSimulation();
      }}
    >
      <View style={GlobalStyles.modalOverlay}>
        <View style={[GlobalStyles.modalContainer, { paddingVertical: 24, minWidth: 300 }]}>
          <View style={styles.circleWrap}>
            <Progress.Circle
              size={140}
              progress={uploadProgress}
              thickness={12}
              color="#00C853"
              unfilledColor="#DFF5E6"
              borderWidth={0}
              showsText={false}
            />

            <View style={styles.circleInner}>
              <Text style={styles.circleText}>{Math.round(uploadProgress * 100)}%</Text>
              <Text style={styles.circleSub}>
                {uploadedFiles.length}/{Math.max(1, uploadedFiles.length)}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Uploading...</Text>
          <Text style={styles.subtitle}>
            Please wait while we securely upload your file{uploadedFiles.length > 1 ? "s" : ""}.
          </Text>

          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileRow}>
              <Ionicons name="document" size={26} color="#000" />
              <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={styles.fileTitle}>{file.fileName || `File ${index + 1}`}</Text>
                <Text style={styles.fileMeta}>
                  {file.type || "Document"} — {file.fileSize ? Math.round(file.fileSize / 1024) : "N/A"} kb
                </Text>
              </View>

              {/* allow user to remove a queued file (optional) */}
              <TouchableOpacity
                onPress={() => {
                  // remove file from list
                  setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.uploadRow}>
            <Text style={styles.rowTitle}>Overall progress</Text>

            <View style={styles.progressRow}>
              <View style={styles.progressLeft}>
                <Text style={styles.progressText}>{Math.round(uploadProgress * 100)}%</Text>
                <Text style={styles.time}>
                  {uploadProgress < 1
                    ? `${Math.max(1, Math.round((1 - uploadProgress) * 30))}s remaining`
                    : "Done"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  // cancel upload
                  stopProgressSimulation();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.round(uploadProgress * 100)}%` }]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              // Finalize - in real app you'd send to server here
              // For now, stop simulation and close modal
              if (uploadIntervalRef.current) {
                clearInterval(uploadIntervalRef.current);
                uploadIntervalRef.current = null;
              }
              setUploadingProgressVisible(false);
              setUploadProgress(0);
              Alert.alert("Upload", "Files uploaded successfully (simulated).");
            }}
          >
            <Text style={styles.submitText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              stopProgressSimulation();
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        <ImageBackground
          source={require("../../../assets/partnerbg.png")}
          style={GlobalStyles.background}
        >
          <View style={GlobalStyles.flexdv}>
            <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
              <View style={GlobalStyles.arrowBox}>
                <Image source={require("../../../assets/arrow1.png")} />
              </View>
              <Text style={GlobalStyles.titleText}>My Documents</Text>
            </TouchableOpacity>

            <View style={GlobalStyles.rightSection}>
              <TouchableOpacity>
                <Image source={require("../../../assets/notification.png")} />
                <View style={GlobalStyles.notiDot} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image source={require("../../../assets/menu-bar.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={GlobalStyles.searchContainer}>
          <View style={GlobalStyles.searchBox}>
            <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={[GlobalStyles.searchinput, { borderWidth: 1, borderColor: "#C5C5C5" }]}
            />
          </View>
        </View>

        {/* DOC ITEM */}
        <View style={{ paddingTop: 20 }}>
          <View style={styles.uploadDoc}>
            {/* LEFT AREA → OPEN UPLOAD MODAL */}
            <TouchableOpacity style={{ flexDirection: "row", flex: 1 }} onPress={() => setUploadDocModal(true)}>
              <View style={styles.uploadLeft}>
                <Image source={require("../../../assets/uploadnoimg.png")} style={styles.uploadImg} />
              </View>

              <View style={styles.uploadRight}>
                <Text style={styles.docTitle}>Aadhaar Card</Text>

                <View style={styles.docStatusRow}>
                  <Image source={require("../../../assets/docicon1.png")} style={styles.docIcon} />
                  <Text style={styles.docStatus}>No documents uploaded</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* RIGHT ELLIPSIS → SEPARATE TOUCH */}
            <TouchableOpacity style={styles.ellipsisBtn} onPress={() => setEditModalVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={18} color="#949494" />
            </TouchableOpacity>
          </View>
        </View>

        {/* UPLOAD DOCUMENT MODAL */}
        <Modal transparent visible={uploadDocModal} animationType="slide" onRequestClose={() => setUploadDocModal(false)}>
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity style={GlobalStyles.modalClose} onPress={() => setUploadDocModal(false)}>
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>

              <Text style={GlobalStyles.mdlTitle}>Upload Documents</Text>
              <Text style={GlobalStyles.mdlSubTitlev2}>Only support .jpg, .png and .pdf .doc files</Text>
              <Text style={GlobalStyles.mdlSubTitle}>Max file size 5 mb</Text>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 }}>
                <TouchableOpacity style={styles.camBg} onPress={handleCameraUpload}>
                  <View style={styles.camera}>
                    <Image source={require("../../../assets/b2bedit1.png")} style={styles.editb2bIcon} />
                  </View>
                  <Text style={styles.editModalText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gallBg} onPress={handleGalleryOrFileUpload}>
                  <View style={styles.gallery}>
                    <Image source={require("../../../assets/b2bedit2.png")} style={styles.editb2bIcon} />
                  </View>
                  <Text style={styles.editModalText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.remBg} onPress={handleGalleryOrFileUpload}>
                  <View style={styles.remove}>
                    <Image source={require("../../../assets/files2.png")} style={styles.editb2bIcon} />
                  </View>
                  <Text style={styles.editModalText}>Files</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* EDIT DOCUMENT MODAL */}
        <Modal transparent visible={editModalVisible} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity style={GlobalStyles.modalClose} onPress={() => setEditModalVisible(false)}>
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
                <TouchableOpacity style={styles.gallBg} onPress={() => Alert.alert("Download", "Download tapped")}>
                  <View style={styles.download}>
                    <Image source={require("../../../assets/docmdldownload.png")} style={styles.editb2bIcon} />
                  </View>
                  <Text style={styles.editModalText}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.remBg} onPress={() => {
                  Alert.alert("Delete", "Delete tapped");
                }}>
                  <View style={styles.remove}>
                    <Image source={require("../../../assets/docmdlremove.png")} style={styles.editb2bIcon} />
                  </View>
                  <Text style={styles.editModalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* UPLOADING PROGRESS */}
        {UploadingProgressView}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateDocuments;

const styles = StyleSheet.create({
    circleWrap: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    circleInner: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },

    circleText: {
        fontSize: 32,
        fontWeight: "700",
        color: "#00C853",
    },
    circleSub: {
        fontSize: 16,
        fontWeight: "500",
        color: "#4CAF50",
        marginTop: -4,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
        marginTop: 24,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        paddingHorizontal: 20,
        marginTop: 8,
        lineHeight: 20,
    },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#F6F6F6",
        borderWidth: 1,
        borderColor: "#E1E1E1",
    },

    fileTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
    },

    fileMeta: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
    uploadRow: {
        marginTop: 25,
        backgroundColor: "#F8F8F8",
        padding: 15,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E2E2",
    },
    rowTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    progressLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    time: {
        fontSize: 12,
        color: "#777",
    },
    progressBar: {
        height: 6,
        width: "100%",
        backgroundColor: "#E5E5E5",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#00C853",
        borderRadius: 10,
    },
    submitBtn: {
        marginTop: 30,
        backgroundColor: "#00C853",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    submitText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    cancelText: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 18,
        color: "#777",
    },

    // Add Documents Modal Start
    docCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginTop: 14,
    },
    docCardIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    docCardRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    docCardName: {
        flex: 1,
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
        paddingRight: 8,
    },
    checkboxBox: {
        width: 16,
        height: 16,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderColor: "#9E9E9E",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxBoxSelected: {
        backgroundColor: "#00A635",
        borderColor: "#00A635",
    },
    // Add Documents Modal End

    // Upload Box Design Start
    uploadDoc: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        // iOS shadow
        shadowColor: '#b1e3ca',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 8,
        shadowRadius: 15,
        // Android shadow
        elevation: 4,
        padding: 6,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    uploadLeft: {
        width: 90,
        height: 90,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: "#F0FBF4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        overflow: "hidden",
    },
    uploadImg: {
        width: 70,
        height: 70,
        resizeMode: "contain",
    },
    uploadRight: {
        flex: 1,
    },
    docTitle: {
        fontSize: 13,
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginBottom: 4,
    },
    docStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    docIcon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
        tintColor: "#777",
    },
    docStatus: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#777",
    },
    docArrow: {
        width: 24,
        height: 24,
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Upload Box Design End

    // Edit Modal Start
    profileTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        lineHeight: 20,
        color: '#535353',
        textAlign: 'center',
        paddingBottom: 24,
    },
    camera: {
        width: 42,
        height: 42,
        alignSelf: 'center',
        backgroundColor: '#00A635',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gallery: {
        width: 42,
        height: 42,
        alignSelf: 'center',
        backgroundColor: '#D9F2E1',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remove: {
        width: 42,
        height: 42,
        alignSelf: 'center',
        backgroundColor: '#E63946',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    download: {
        width: 42,
        height: 42,
        alignSelf: 'center',
        backgroundColor: '#B59A3E',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editb2bIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    editModalText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
        textAlign: 'center',
        paddingTop: 12,
    },
    camBg: {
        backgroundColor: 'rgba(0, 166, 53, 0.15)',
        borderRadius: 22,
        width: 90,
        paddingVertical: 16,
    },
    gallBg: {
        backgroundColor: 'rgba(167, 167, 167, 0.15)',
        borderRadius: 22,
        width: 90,
        paddingVertical: 16,
    },
    remBg: {
        backgroundColor: 'rgba(255, 235, 237, 1)',
        borderRadius: 22,
        width: 90,
        paddingVertical: 16,
    },
    // Edit Modal End

})