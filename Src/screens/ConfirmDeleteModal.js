// ConfirmDeleteModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmDeleteModal = ({ visible, message, onConfirm, onCancel }) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Are you sure?</Text>

                    {/* Dynamic Message */}
                    <Text style={styles.subTitle}>{message}</Text>

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.noBtn} onPress={onCancel}>
                            <Text style={styles.noText}>No</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.yesBtn} onPress={onConfirm}>
                            <Text style={styles.yesText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        color: "#555",
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    yesBtn: {
        flex: 1,
        backgroundColor: "#F44336",
        padding: 12,
        borderRadius: 8,
        marginLeft: 5,
        alignItems: "center",
    },
    noBtn: {
        flex: 1,
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginRight: 5,
        alignItems: "center",
    },
    yesText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    noText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});

export default ConfirmDeleteModal;
