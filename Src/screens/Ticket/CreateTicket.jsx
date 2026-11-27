import React, { useState, useEffect, useMemo } from "react";
import {
    View, Text, SafeAreaView, ScrollView, Modal, TouchableOpacity, Image,
    StyleSheet, TextInput, FlatList, ActivityIndicator, Alert, PermissionsAndroid, Platform,
} from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ClientService from '../../services/client_service';

// ---------- helpers ----------
const calcAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();

    if (d < 0) {
        m -= 1;
        d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (m < 0) {
        y -= 1;
        m += 12;
    }
    return `${y}Y-${m}M-${d}D`;
};

const sameDay = (iso, date) => {
    const a = new Date(iso);
    return (
        a.getFullYear() === date.getFullYear() &&
        a.getMonth() === date.getMonth() &&
        a.getDate() === date.getDate()
    );
};

const CustomCheck = ({ selected }) => (
    <View
        style={{
            width: 15,
            height: 15,
            borderRadius: 7.5,
            borderWidth: 1,
            borderColor: selected ? "#00A635" : "#C5C5C5",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: selected ? "#E6FFF3" : "transparent",
        }}
    >
        {selected && (
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: "#00A635" }} />
        )}
    </View>
);

const placeholders = ["Search by Patient Name", "Search by Investigation ID"];

function CreateTicket({ navigation }) {
    // form state
    const [ticketSubject, setTicketSubject] = useState("");
    const [priority, setPriority] = useState("low");
    const [description, setDescription] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [regError, setRegError] = useState("");

    // subjects
    const [subjects, setSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(false);

    // submit
    const [submitting, setSubmitting] = useState(false);

    // patient modal
    const [patientModal, setPatientModal] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [regLoading, setRegLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [tempSelectedId, setTempSelectedId] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // date picker
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    // ---------- API: subjects on screen load ----------
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setSubjectsLoading(true);
                const res = await ClientService.getAllTicketSubjects();

                if (res?.status === 1 && Array.isArray(res.data)) {
                    const filtered = res.data.filter(
                        (s) =>
                            s.status === true &&
                            s.is_deleted === false &&
                            String(s.module || "").toLowerCase() === "client"
                    );
                    setSubjects(filtered);
                }
            } catch (e) {
                Alert.alert("Error", "Unable to load ticket subjects.");
            } finally {
                setSubjectsLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    // placeholder animation
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    // ---------- API: registrations when Choose Patient is clicked ----------
    const openPatientModal = async () => {
        setTempSelectedId(selectedRegistration?.id ?? null);
        setRegError("");
        setPatientModal(true);

        try {
            setRegLoading(true);
            const res = await ClientService.getAllB2BRegistration();

            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.data?.data)
                ? res.data.data
                : Array.isArray(res?.data?.rows)
                ? res.data.rows
                : [];

            console.log("Registrations parsed count:", list.length);

            if (list.length === 0) {
                setRegError(res?.message || "No patients found");
            }

            setRegistrations(list);
        } catch (e) {
            setRegistrations([]);
            setRegError(
                e?.response?.data?.message ||
                e?.message ||
                "Unable to load patients"
            );
        } finally {
            setRegLoading(false);
        }
    };

    // client-side filter: date + search
    const filteredRegistrations = useMemo(() => {
        const q = searchText.trim().toLowerCase();

        return registrations.filter((r) => {
            if (selectedDate && !sameDay(r.createdAt, selectedDate)) {
                return false;
            }

            if (!q) return true;

            return (
                String(r.patient?.patient_name || "").toLowerCase().includes(q) ||
                String(r.investigationId || "").toLowerCase().includes(q)
            );
        });
    }, [registrations, searchText, selectedDate]);

    const handleSelectPatient = () => {
        const reg = registrations.find((r) => r.id === tempSelectedId) || null;
        setSelectedRegistration(reg);
        setPatientModal(false);
    };

    // API 1: Create Ticket (JSON only)
    const handleSubmit = async () => {
        if (!ticketSubject) {
            Alert.alert("Required", "Please select a ticket subject.");
            return;
        }

        if (!description.trim()) {
            Alert.alert("Required", "Please enter a description.");
            return;
        }

        const payload = {
            module: "CLIENT",
            subjectId: Number(ticketSubject),
            priority: priority.toUpperCase(),
            description: description.trim(),
        };

        if (selectedRegistration) {
            payload.registration_id = Number(selectedRegistration.id);
        }

        try {
            setSubmitting(true);
            console.log("Create Ticket Payload:", JSON.stringify(payload));

            const res = await ClientService.createTicket(payload);

            if (res?.status !== 1) {
                Alert.alert("Error", res?.message || "Failed to create ticket.");
                return;
            }

            const createdTicketId =
                res.data?.id ??
                res.data?.ticketId ??
                res.data?.ticket_id;

            // API 2 sends the same Description as the comment, with attachments.
            if (description.trim() || attachments.length > 0) {
                if (!createdTicketId) {
                    Alert.alert(
                        "Ticket Created",
                        `Ticket ${res.data?.ticketNo || ""} was created, but the response did not include a ticket ID. Comment/attachments were not sent.`
                    );
                    return;
                }

                try {
                    await handleSendComment(
                        createdTicketId,
                        description.trim(),
                        attachments
                    );

                    Alert.alert(
                        "Success",
                        `Ticket created successfully.\nTicket No: ${res.data?.ticketNo || createdTicketId}`,
                        [{ text: "OK", onPress: () => navigation.goBack() }]
                    );
                } catch (commentError) {
                    console.log(
                        "Comment API Error:",
                        commentError?.response?.data || commentError
                    );

                    Alert.alert(
                        "Ticket Created",
                        `Ticket No: ${res.data?.ticketNo || createdTicketId} was created, but the comment/attachments could not be sent. You can add them from the ticket details screen.`,
                        [{ text: "OK", onPress: () => navigation.goBack() }]
                    );
                }
            } else {
                Alert.alert(
                    "Success",
                    `Ticket created successfully.\nTicket No: ${res.data?.ticketNo || ""}`,
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            }
        } catch (e) {
            console.log("Create Ticket Error:", e?.response?.data || e);
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // API 2: Add Comment with Attachments (multipart/form-data)
    // Called after createTicket when the newly created ticket ID is available.
    const handleSendComment = async (
        ticketIdToUse,
        descriptionText,
        selectedFiles = [],
    ) => {
        if (!ticketIdToUse) {
            throw new Error("Ticket ID is required to send a comment.");
        }

        if (!descriptionText?.trim() && selectedFiles.length === 0) {
            return null;
        }

        const formData = new FormData();

        // Existing Description field is sent as the comment.
        formData.append(
            "comment",
            descriptionText?.trim() || "Ticket attachment"
        );

        formData.append("ticketId", String(ticketIdToUse));

        selectedFiles.forEach((file, index) => {
            formData.append("ticket_attachments", {
                uri: file.uri,
                name: file.name || `attachment_${Date.now()}_${index}`,
                type: file.type || "application/octet-stream",
            });
        });

        const response = await ClientService.addTicketComment(formData);

        console.log("Add Comment Response:", response);

        if (response?.status !== 1) {
            throw new Error(response?.message || "Failed to add comment.");
        }

        setAttachments([]);
        return response;
    };

    // ---------- Attachments (camera / gallery) ----------
    const requestCameraPermission = async () => {
        if (Platform.OS !== "android") return true;

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (e) {
            return false;
        }
    };

    const handlePickerResult = (result) => {
        if (result?.didCancel) return;

        if (result?.errorCode) {
            Alert.alert("Error", result.errorMessage || result.errorCode);
            return;
        }

        const files = (result?.assets || []).map((a) => ({
            uri: a.uri,
            name: a.fileName || `attachment_${Date.now()}.jpg`,
            type: a.type || "image/jpeg",
        }));

        setAttachments((prev) => [...prev, ...files]);
    };

    const openCamera = async () => {
        const ok = await requestCameraPermission();

        if (!ok) {
            Alert.alert(
                "Permission needed",
                "Please allow camera permission in settings."
            );
            return;
        }

        launchCamera(
            { mediaType: "photo", quality: 0.7, saveToPhotos: false },
            handlePickerResult
        );
    };

    const openGallery = () => {
        launchImageLibrary(
            { mediaType: "photo", selectionLimit: 5, quality: 0.7 },
            handlePickerResult
        );
    };

    const showAttachOptions = () => {
        Alert.alert("Upload Attachment", "Choose an option", [
            { text: "Camera", onPress: openCamera },
            { text: "Gallery", onPress: openGallery },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const renderItem = ({ item }) => {
        const isSelected = tempSelectedId === item.id;
        const gender = item.patient?.gender === 2 ? "female" : "male";

        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setTempSelectedId(isSelected ? null : item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <Text style={styles.code}>{item.investigationId}</Text>
                    <CustomCheck selected={isSelected} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.name}>
                        {item.patient?.patient_name}
                    </Text>

                    <Ionicons
                        name={gender}
                        size={18}
                        color={gender === "male" ? "#007bff" : "#e83e8c"}
                    />
                </View>

                <Text style={styles.age}>
                    {calcAge(item.patient?.dob)}
                </Text>
            </TouchableOpacity>
        );
    };
        return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView style={{ flex: 1 }}>
                <LinearGradient
                    colors={["#d0eede", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={GlobalStyles.background}
                >
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity
                            style={GlobalStyles.leftArrow}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={GlobalStyles.arrowBox}>
                                <Image
                                    source={require("../../../assets/arrow1.png")}
                                />
                            </View>

                            <Text style={GlobalStyles.titleText}>
                                Create Ticket
                            </Text>
                        </TouchableOpacity>

                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: "relative" }}>
                                <Image
                                    source={require("../../../assets/notification.png")}
                                />
                                <View style={GlobalStyles.notiDot}></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate("Profile")}
                            >
                                <Image
                                    source={require("../../../assets/menu-bar.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 16 }}>
                    {/* Ticket Subject */}
                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>
                            Ticket Subject
                            <Text style={GlobalStyles.regText}>*</Text>
                        </Text>

                        <View style={GlobalStyles.pickerInput}>
                            {subjectsLoading ? (
                                <ActivityIndicator
                                    style={{ padding: 14 }}
                                    color="#00A635"
                                />
                            ) : (
                                <Picker
                                    selectedValue={ticketSubject}
                                    onValueChange={(itemValue) =>
                                        setTicketSubject(itemValue)
                                    }
                                >
                                    <Picker.Item
                                        label="Select option"
                                        value=""
                                    />

                                    {subjects.map((s) => (
                                        <Picker.Item
                                            key={s.id}
                                            label={s.subjectName}
                                            value={s.id}
                                        />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    </View>

                    {/* Choose Patient */}
                    <TouchableOpacity
                        onPress={openPatientModal}
                        style={styles.chPtBtn}
                    >
                        <View style={styles.chPtLeft}>
                            <Image
                                source={require("../../../assets/b2bchpticon.png")}
                                style={styles.chPtIcon}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.chPtText}>
                                    {selectedRegistration
                                        ? selectedRegistration.patient?.patient_name
                                        : "Choose Patient"}
                                </Text>

                                {selectedRegistration && (
                                    <Text style={styles.chPtSub}>
                                        {selectedRegistration.investigationId}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.chPtRight}>
                            {selectedRegistration && (
                                <Text style={styles.chPtAddInv}>1</Text>
                            )}

                            <View style={styles.chPtArrow}>
                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color="#000"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Priority */}
                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>
                            Select Priority
                            <Text style={GlobalStyles.regText}>*</Text>
                        </Text>

                        <View style={styles.priorityContainer}>
                            {["low", "medium", "high"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.priorityBtn,
                                        priority === item &&
                                            styles.priorityBtnActive,
                                    ]}
                                    onPress={() => setPriority(item)}
                                >
                                    <Text
                                        style={[
                                            styles.priorityText,
                                            priority === item &&
                                                styles.priorityTextActive,
                                        ]}
                                    >
                                        {item.charAt(0).toUpperCase() +
                                            item.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description */}
                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>
                            Description
                            <Text style={GlobalStyles.regText}>*</Text>
                        </Text>

                        <TextInput
                            placeholder="Description here"
                            placeholderTextColor="#999"
                            style={styles.input}
                            multiline={true}
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <TouchableOpacity
                        style={GlobalStyles.reOpenBtn}
                        onPress={showAttachOptions}
                    >
                        <Text style={GlobalStyles.reOpenBtnText}>
                            Upload Attachment
                        </Text>
                    </TouchableOpacity>

                    {attachments.map((f, i) => (
                        <View
                            key={`${f.uri}-${i}`}
                            style={styles.attachRow}
                        >
                            <Image
                                source={{ uri: f.uri }}
                                style={styles.attachThumb}
                            />

                            <Text
                                style={styles.attachName}
                                numberOfLines={1}
                            >
                                {f.name}
                            </Text>

                            <TouchableOpacity
                                onPress={() => removeAttachment(i)}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={22}
                                    color="#E53935"
                                />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[
                            GlobalStyles.applyBtnFullWidth,
                            submitting && { opacity: 0.6 },
                        ]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={GlobalStyles.applyBtnTextNew}>
                                Submit Ticket
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Patient Modal */}
                <Modal
                    transparent
                    visible={patientModal}
                    animationType="slide"
                    onRequestClose={() => setPatientModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPatientModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>
                                Select Patients
                            </Text>

                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>
                                    Select Date
                                </Text>

                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={showDatePicker}
                                >
                                    <Text>
                                        {selectedDate
                                            ? selectedDate.toDateString()
                                            : "Select date"}
                                    </Text>

                                    <Image
                                        source={require("../../../assets/mdl-calender.png")}
                                        style={styles.calenderIcon}
                                    />
                                </TouchableOpacity>
                            </View>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                date={selectedDate || new Date()}
                            />

                            {/* Search */}
                            <View
                                style={[
                                    GlobalStyles.searchContainer,
                                    {
                                        marginHorizontal: 0,
                                        marginBottom: 25,
                                    },
                                ]}
                            >
                                <View style={GlobalStyles.searchBox}>
                                    <Ionicons
                                        name="search"
                                        size={20}
                                        color="#aaa"
                                        style={GlobalStyles.searchIcon}
                                    />

                                    <TextInput
                                        placeholder={placeholders[placeholderIndex]}
                                        placeholderTextColor="#999"
                                        value={searchText}
                                        onChangeText={setSearchText}
                                        style={[
                                            GlobalStyles.searchinput,
                                            {
                                                borderWidth: 1,
                                                borderColor: "#C5C5C5",
                                                borderRadius: 10,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Result Count */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 10,
                                }}
                            >
                                <Image
                                    source={require("../../../assets/filtericon.png")}
                                    style={styles.filtIconMdl}
                                />

                                <Text style={styles.filtTextMdl}>
                                    {filteredRegistrations.length} Result Found
                                </Text>

                                {selectedDate && (
                                    <TouchableOpacity
                                        onPress={() => setSelectedDate(null)}
                                    >
                                        <Text style={styles.clearDate}>
                                            Clear date
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ height: 270, marginTop: 5 }}>
                                {regLoading ? (
                                    <ActivityIndicator
                                        style={{ marginTop: 40 }}
                                        color="#00A635"
                                    />
                                ) : (
                                    <FlatList
                                        data={filteredRegistrations}
                                        renderItem={renderItem}
                                        keyExtractor={(item) =>
                                            String(item.id)
                                        }
                                        showsVerticalScrollIndicator={true}
                                        ListEmptyComponent={
                                            <Text style={styles.emptyText}>
                                                {regError || "No patients found"}
                                            </Text>
                                        }
                                    />
                                )}
                            </View>

                            <TouchableOpacity
                                style={GlobalStyles.applyBtnFullWidth}
                                onPress={handleSelectPatient}
                            >
                                <Text style={GlobalStyles.applyBtnTextNew}>
                                    Select
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CreateTicket;
const styles = StyleSheet.create({
    input: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        height: 85,
        borderWidth: 1,
        borderColor: "#C5C5C5",
        borderRadius: 10,
        padding: 10,
        textAlignVertical: "top",
        color: "#000",
    },

    priorityContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5,
    },

    priorityBtn: {
        borderWidth: 1,
        borderColor: "#A0DDB5",
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    priorityBtnActive: {
        backgroundColor: "#00A635",
        borderColor: "#00A635",
    },

    priorityText: {
        fontFamily: "Poppins-Medium",
        color: "#000",
        fontSize: 12,
        lineHeight: 15,
    },

    priorityTextActive: {
        color: "#fff",
    },

    // Select Patient Modal
    calenderIcon: {
        position: "absolute",
        right: 12,
        top: 15,
        tintColor: "#00A635",
    },

    card: {
        borderBottomWidth: 1,
        borderBottomColor: "#00A635",
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 1,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },

    cardSelected: {
        backgroundColor: "#E6FFF7",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    code: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        lineHeight: 15,
        color: "#2C68FF",
        backgroundColor: "rgba(44, 104, 255, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    name: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        marginRight: 6,
    },

    age: {
        fontFamily: "Poppins-Regular",
        color: "#9F9F9F",
        fontSize: 13,
        lineHeight: 16,
    },

    filtIconMdl: {
        width: 18,
        height: 15,
        objectFit: "contain",
    },

    filtTextMdl: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        lineHeight: 16,
        color: "#7D7B7B",
    },

    clearDate: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        color: "#00A635",
        marginLeft: 8,
    },

    emptyText: {
        fontFamily: "Poppins-Regular",
        fontSize: 13,
        color: "#9F9F9F",
        textAlign: "center",
        marginTop: 40,
    },

    // Choose Patient button
    chPtBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0FDF6",
        borderWidth: 1,
        borderColor: "#00A635",
        borderRadius: 15,
        padding: 10,
        marginBottom: 14,
    },

    chPtLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    chPtIcon: {
        width: 40,
        height: 40,
        objectFit: "contain",
    },

    chPtText: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        color: "#000",
    },

    chPtSub: {
        fontFamily: "Poppins-Regular",
        fontSize: 11,
        color: "#7D7B7B",
    },

    chPtRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    chPtAddInv: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
        backgroundColor: "#33E087",
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },

    chPtArrow: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#B9DFCB",
        justifyContent: "center",
        alignItems: "center",
    },

    attachRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#C5C5C5",
        borderRadius: 10,
        padding: 8,
        marginBottom: 10,
    },

    attachThumb: {
        width: 40,
        height: 40,
        borderRadius: 6,
    },

    attachName: {
        flex: 1,
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        color: "#000",
    },
});