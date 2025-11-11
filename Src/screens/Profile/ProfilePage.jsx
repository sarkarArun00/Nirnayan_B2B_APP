import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, TextInput, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClientService from '../../services/client_service';
import AlertModal from '../../componenets/AlertModal';
import * as ImagePicker from 'react-native-image-picker';
import { BASE_API_URL } from '../../services/API';


function ProfilePage() {
    const navigation = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [personalDetailsModal, setPersonalDetailsModal] = useState(false);
    const [contactInfModal, setContactInfModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [clientId, setClientId] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [agreementName, setAgreementName] = useState("");
    const [agreementError, setAgreementError] = useState("");
    const [borderColor, setBorderColor] = useState("#C2C2C2");

    const [phone, setPhone] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [businessAddressErr, setBusinessAddressErr] = useState("");

    const [latLong, setLatLong] = useState("");
    const [latLongErr, setLatLongErr] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [currentErr, setCurrentErr] = useState("");
    const [newErr, setNewErr] = useState("");
    const [confirmErr, setConfirmErr] = useState("");
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [showConfirmPasswordRules, setShowConfirmPasswordRules] = useState(false);
    const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");
    const [passwordStrengthColor, setPasswordStrengthColor] = useState("#ccc");
    const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(false);
    const [email, setEmail] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');  // 'success' | 'error' | 'warning'
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [propic, setPropic] = useState('');

    const route = useRoute();
    useEffect(() => {
        if (route.params?.openModal) {
            setPasswordModal(true);
        }
    }, [route.params]);


    const passwordRules = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[@$!%*?&]/.test(newPassword)
    };

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const latLongRegex = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/;

    // open phone camera
    const openCamera = async () => {
        try {
            setShowImagePicker(false);

            const result = await ImagePicker.launchCamera({
                mediaType: 'photo',
                quality: 0.8
            });

            if (result.didCancel) return; // User closed camera
            if (result.errorCode) {
                console.log("Camera Error:", result.errorMessage);
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                await uploadProfilePic(asset.uri, asset.fileName, asset.type); // await upload
            }

        } catch (err) {
            console.log("openCamera Error:", err);
        }
    };

    // open phone gallery
    const openGallery = async () => {
        try {
            setShowImagePicker(false);

            const result = await ImagePicker.launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8
            });

            if (result.didCancel) return;
            if (result.errorCode) {
                console.log("Gallery Error:", result.errorMessage);
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                await uploadProfilePic(asset.uri, asset.fileName, asset.type);
            }

        } catch (err) {
            console.log("openGallery Error:", err);
        }
    };


    const uploadProfilePic = async (uri, fileName, type) => {
        try {

            const response = await fetch(uri);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('partnerId', clientId);

            formData.append('profilePic', {
                name: fileName || `profile_${Date.now()}.jpg`,
                type: type || blob.type || 'image/jpeg',
                uri,
                data: blob, // <-- THIS MAKES IT BINARY
            });
            const res = await ClientService.updateProfilePicture(formData);

            if (res.status === 1) {
                showAlert("Profile picture updated successfully!", "success");
            } else {
                showAlert(res.message || "Could not update profile picture", "warning");
            }

        } catch (err) {
            console.log("Upload Error:", err);
            showAlert(err?.response?.data?.message || "Upload failed", "danger");
        }
    };


    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setModalVisible(true);
    };

    const evaluatePasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;                          // length
        if (/[A-Z]/.test(password)) score++;                        // uppercase
        if (/[a-z]/.test(password)) score++;                        // lowercase
        if (/[0-9]/.test(password)) score++;                        // number
        if (/[@$!%*#?&]/.test(password)) score++;                   // special char

        setPasswordStrengthScore(score);

        switch (score) {
            case 0:
            case 1:
                setPasswordStrengthLabel("Very Weak");
                setPasswordStrengthColor("#dc3545"); // red
                break;
            case 2:
                setPasswordStrengthLabel("Weak");
                setPasswordStrengthColor("#fdf914ff"); // orange
                break;
            case 3:
                setPasswordStrengthLabel("Medium");
                setPasswordStrengthColor("#fd7e14"); // yellow
                break;
            case 4:
                setPasswordStrengthLabel("Strong");
                setPasswordStrengthColor("#56fd14ff"); // green
                break;
            case 5:
                setPasswordStrengthLabel("Very Strong");
                setPasswordStrengthColor("#28a745"); // blue
                break;
        }
    };


    const handleAddressChange = (text) => {
        setBusinessAddress(text);
        if (!text.trim()) {
            setBusinessAddressErr("Business Address is required");
        } else if (text.trim().length < 3) {
            setBusinessAddressErr("Enter a valid Business Address");
        } else {
            setBusinessAddressErr("");
        }
    };

    const handleLatLongChange = (text) => {
        setLatLong(text);
        if (!text.trim()) {
            setLatLongErr("Latitude & Longitude is required");
        } else if (!latLongRegex.test(text)) {
            setLatLongErr("Enter a valid value (Example: 28.9278, 77.1025)");
        } else {
            setLatLongErr("");
        }
    };

    const handleContactInfoUpdate = async () => {
        if (!businessAddress.trim()) {
            setBusinessAddressErr("Business Address is required");
        }

        if (!latLong.trim() || !latLongRegex.test(latLong)) {
            setLatLongErr("Latitude & Longitude is required");
        }

        if (businessAddressErr || latLongErr || !businessAddress.trim() || !latLong.trim()) {
            return;
        }

        const [latitude, longitude] = latLong.split(",").map(item => item.trim());

        const payload = {
            clientId: clientId,
            address: businessAddress,
            latitude: latitude,
            longitude: longitude
        };

        try {
            // Optional loading state
            const res = await ClientService.updateContactProfile(payload);
            console.log("API Success:", res);
            setContactInfModal(false); // Close modal after success

        } catch (error) {
            console.log("API Error:", error);
        }
    };

    const handlePasswordUpdate = async () => {

        if (!currentPassword.trim()) {
            setCurrentErr("Current password is required");
        }

        if (!newPassword.trim()) {
            setNewErr("New password is required");
        } else if (
            !passwordRules.length ||
            !passwordRules.uppercase ||
            !passwordRules.lowercase ||
            !passwordRules.number ||
            !passwordRules.special
        ) {
            setNewErr("Password does not meet the requirements");
        }

        if (!confirmPassword.trim()) {
            setConfirmErr("Confirm password is required");
        } else if (newPassword !== confirmPassword) {
            setConfirmErr("Passwords do not match");
        }

        if (
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim() ||
            newPassword !== confirmPassword
        ) {
            return;
        }
        const payload = {
            emailOrMobile: email,
            oldPassword: currentPassword,
            newPassword: newPassword,
        };

        console.log("payload", payload);

        try {

            const res = await ClientService.updatePassword(payload);
            if (res.status == 1) {
                setPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
                showAlert("Password Updated successfully!", "success");
            }
            else if (res.status == 0) {
                console.log("hitt5");

                showAlert(res.data, "warning");
            }

        } catch (e) {
        }
        setPasswordModal(false);
    };




    const validateAgreementName = (text) => {
        // Allow only alphabets and spaces
        let formattedText = text.replace(/[^A-Za-z ]/g, "");

        // Remove leading spaces
        formattedText = formattedText.replace(/^\s+/g, "");

        // Prevent multiple spaces in between
        formattedText = formattedText.replace(/\s{2,}/g, " ");

        setDisplayName(formattedText);

        if (formattedText.trim().length === 0) {
            setAgreementError("Display Name is required");
            setBorderColor("red");
        } else {
            setAgreementError("");
            setBorderColor("green");
        }
    };

    const handleUpdate = () => {
        if (!displayName.trim()) {
            setAgreementError("Display Name is required");
            setBorderColor("red");
            return;
        }
    };


    useEffect(() => {
        AsyncStorage.getItem("user_id").then(id => setClientId(id));
    }, []);

    useEffect(() => {
        if (clientId) {
            fetchClientDetails();
        }
    }, [clientId]);

    const fetchClientDetails = async () => {
        const payload = {
            schemaName: "nir1691144565",
            clientId: clientId
        };

        try {
            const response = await ClientService.getClientById(payload);
            console.log("Auto API Success:", response);
            if (response.success == true) {
                setDisplayName(response.data.profileName || "");
                setAgreementName(response.data.agreementName || "");
                setPhone(response.data.contact_number || "");
                setEmail(response.data.email || "");
                setPropic(
                    response.data.profilePic
                        ? `${BASE_API_URL}${response.data.profilePic}`
                        : ""
                );
                setBusinessAddress(response.data.address || "");
                setLatLong(response.data.latitude+' , '+response.data.longitude || "")

            }
        } catch (error) {
            console.log("Auto API Error:", error);
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={styles.titleText}>Profile</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View>
                    <View style={styles.proImgSec}>
                        <Image
                            style={styles.proImg}
                            source={
                                propic
                                    ? { uri: propic }
                                    : require('../../../assets/profile2.png')
                            }
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={() => setEditModalVisible(true)}>
                            <Image source={require('../../../assets/b2bedit.png')} style={styles.editImg} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userId}>Client ID: {clientId}</Text>
                    <View style={styles.accWrap}>
                        <TouchableOpacity style={styles.accBox} onPress={() => setPersonalDetailsModal(true)}>
                            <Image source={require('../../../assets/b2bac1.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Personal Deatils</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accBox} onPress={() => setContactInfModal(true)}>
                            <Image source={require('../../../assets/b2bac2.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Contact Information</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accBox} onPress={() => setPasswordModal(true)}>
                            <Image source={require('../../../assets/b2bac3.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Password & Security</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Edit Modal Start */}
                <Modal
                    transparent={true}
                    visible={editModalVisible}
                    animationType="slide"
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.profileTitle}>Profile Photo</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, }}>
                                <TouchableOpacity style={styles.camBg} onPress={openCamera}>
                                    <View style={styles.camera}>
                                        <Image source={require('../../../assets/b2bedit1.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.gallBg} onPress={openGallery}>
                                    <View style={styles.gallery}>
                                        <Image source={require('../../../assets/b2bedit2.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.remBg}>
                                    <View style={styles.remove}>
                                        <Image source={require('../../../assets/b2bedit3.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Personal Details */}
                <Modal
                    transparent={true}
                    visible={personalDetailsModal}
                    animationType="slide"
                    onRequestClose={() => setPersonalDetailsModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>

                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPersonalDetailsModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle}>Personal Details</Text>

                            <ScrollView style={{ paddingTop: 14 }} showsVerticalScrollIndicator={false}>

                                {/* Display Name (Disabled) */}
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Display Name</Text>
                                    <TextInput
                                        value={displayName}
                                        onChangeText={validateAgreementName}
                                        style={[GlobalStyles.input, { borderColor: borderColor, borderWidth: 1 }]}
                                        placeholderTextColor="#C2C2C2"
                                    />
                                    {agreementError ? (
                                        <Text style={{ color: "red", marginTop: 4 }}>{agreementError}</Text>
                                    ) : null}

                                </View>

                                {/* Agreement Name */}
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Agreement Name</Text>

                                    <TextInput
                                        value={agreementName}
                                        editable={false}
                                        placeholderTextColor="#C2C2C2"
                                        style={[GlobalStyles.input, { backgroundColor: "#EFEFEF" }]}
                                    />


                                    {/* <Text style={GlobalStyles.maxTextLength}>Max 50 Characters</Text> */}
                                </View>

                                {/* Update Button */}
                                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleUpdate}>
                                    <Text style={GlobalStyles.applyBtnTextNew}>Update</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Contact Information */}
                <Modal
                    transparent={true}
                    visible={contactInfModal}
                    animationType="slide"
                    onRequestClose={() => setContactInfModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setContactInfModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle}>Contact Information</Text>

                            <ScrollView style={{ paddingTop: 14 }} showsVerticalScrollIndicator={false}>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Business Phone<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <TextInput
                                        value={phone}
                                        placeholder="Enter Phone"
                                        style={[GlobalStyles.input, GlobalStyles.disabledInput]}
                                        placeholderTextColor="#C2C2C2"
                                        editable={false}
                                    />
                                </View>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Business Address<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <TextInput
                                        value={businessAddress}
                                        onChangeText={handleAddressChange}
                                        placeholder="Enter Address"
                                        style={[
                                            GlobalStyles.input,
                                            { borderColor: businessAddressErr ? "red" : businessAddress ? "green" : "#C2C2C2" }
                                        ]}
                                        placeholderTextColor="#C2C2C2"
                                    />
                                    {businessAddressErr ? <Text style={{ color: "red" }}>{businessAddressErr}</Text> : null}
                                </View>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Latitude & Longitude<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            value={latLong}
                                            onChangeText={handleLatLongChange}
                                            placeholder="28.9278, 77.1025"
                                            style={[
                                                GlobalStyles.input,
                                                { borderColor: latLongErr ? "red" : latLong ? "green" : "#C2C2C2" }
                                            ]}
                                            placeholderTextColor="#C2C2C2"
                                        />

                                        <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate('LocationPage')}>
                                            <Text style={styles.changeBtnText}>Change</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {latLongErr ? <Text style={{ color: "red" }}>{latLongErr}</Text> : null}
                                </View>

                                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleContactInfoUpdate}>
                                    <Text style={GlobalStyles.applyBtnTextNew}>Update</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </View>
                </Modal>


                {/* Password Modal */}
                <Modal
                    transparent={true}
                    visible={passwordModal}
                    animationType="slide"
                    onRequestClose={() => setPasswordModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPasswordModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Password & Security</Text>
                            <ScrollView style={{ paddingTop: 14, }}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Current Password<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            value={currentPassword}
                                            onChangeText={(txt) => { setCurrentPassword(txt); setCurrentErr(""); }}
                                            placeholder="Current Password"
                                            style={[GlobalStyles.input, { borderColor: currentErr ? "red" : "#C2C2C2", paddingRight: 40 }]}
                                            placeholderTextColor="#C2C2C2"
                                            secureTextEntry={!showCurrent}
                                        />
                                        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeButton}>
                                            <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                                        </TouchableOpacity>
                                    </View>
                                    {currentErr ? <Text style={{ color: "red" }}>{currentErr}</Text> : null}
                                </View>

                                {/* NEW PASSWORD */}
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>New Password<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            value={newPassword}
                                            onChangeText={(txt) => {
                                                setNewPassword(txt);
                                                evaluatePasswordStrength(txt);
                                                setNewErr("");
                                            }}
                                            onFocus={() => setShowPasswordRules(true)}
                                            placeholder="New Password"
                                            style={[GlobalStyles.input, { borderColor: newErr ? "red" : "#C2C2C2", paddingRight: 40 }]}
                                            secureTextEntry={!showNew}
                                        />

                                        <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeButton}>
                                            <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                                        </TouchableOpacity>
                                    </View>
                                    {newErr ? <Text style={{ color: "red" }}>{newErr}</Text> : null}
                                </View>

                                {/* PASSWORD RULES (Shown only after typing/focus) */}
                                {showPasswordRules && (
                                    <View style={{ marginBottom: 10 }}>

                                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                            <Ionicons
                                                name={passwordRules.length ? "checkmark" : "checkmark"}
                                                size={16}
                                                color={passwordRules.length ? "green" : ""}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={{ color: passwordRules.length ? "green" : "" }}>
                                                Minimum 8 Characters
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                            <Ionicons
                                                name={passwordRules.uppercase ? "checkmark" : "checkmark"}
                                                size={16}
                                                color={passwordRules.uppercase ? "green" : ""}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={{ color: passwordRules.uppercase ? "green" : "" }}>
                                                At least one Uppercase letter
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                            <Ionicons
                                                name={passwordRules.lowercase ? "checkmark" : "checkmark"}
                                                size={16}
                                                color={passwordRules.lowercase ? "green" : ""}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={{ color: passwordRules.lowercase ? "green" : "" }}>
                                                At least one Lowercase letter
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                            <Ionicons
                                                name={passwordRules.number ? "checkmark" : "checkmark"}
                                                size={16}
                                                color={passwordRules.number ? "green" : ""}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={{ color: passwordRules.number ? "green" : "" }}>
                                                At least one Number
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                            <Ionicons
                                                name={passwordRules.special ? "checkmark" : "checkmark"}
                                                size={16}
                                                color={passwordRules.special ? "green" : ""}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={{ color: passwordRules.special ? "green" : "" }}>
                                                At least one Special Character (@$!%*?&)
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 6 }}>
                                            <View style={styles.strengthWrapper}>
                                                <View
                                                    style={[
                                                        styles.strengthBar,
                                                        {
                                                            width: `${passwordStrengthScore * 20}%`,
                                                            backgroundColor: passwordStrengthColor
                                                        }
                                                    ]}
                                                />
                                            </View>

                                            {passwordStrengthLabel !== "" && (
                                                <Text style={[styles.strengthLabel, { color: passwordStrengthColor }]}>
                                                    {passwordStrengthLabel}
                                                </Text>
                                            )}
                                        </View>


                                    </View>
                                )}


                                {/* CONFIRM PASSWORD */}
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Confirm Password<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            value={confirmPassword}
                                            onChangeText={(txt) => { setConfirmPassword(txt); setConfirmErr(""); }}
                                            placeholder="Confirm Password"
                                            style={[
                                                GlobalStyles.input,
                                                { borderColor: confirmPassword && newPassword !== confirmPassword ? "red" : confirmPassword ? "green" : "#C2C2C2", paddingRight: 40 }
                                            ]}
                                            placeholderTextColor="#C2C2C2"
                                            secureTextEntry={!showConfirm}
                                            onFocus={() => setShowConfirmPasswordRules(true)}
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeButton}>
                                            <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                                        </TouchableOpacity>
                                    </View>

                                    {showConfirmPasswordRules && (
                                        <View style={{ marginBottom: 10 }}>
                                            {confirmPassword.length > 0 && (
                                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                                    <Ionicons
                                                        name={newPassword === confirmPassword ? "checkmark" : "checkmark"}
                                                        size={18}
                                                        color={newPassword === confirmPassword ? "green" : ""}
                                                        style={{ marginRight: 6 }}
                                                    />
                                                    <Text
                                                        style={{
                                                            fontWeight: "600",
                                                            color: newPassword === confirmPassword ? "green" : ""
                                                        }}
                                                    >
                                                        {newPassword === confirmPassword
                                                            ? "Passwords match"
                                                            : "Passwords do not match"}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}


                                </View>

                                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handlePasswordUpdate}>
                                    <Text style={GlobalStyles.applyBtnTextNew}>Update</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </View>
                </Modal>


            </ScrollView>
            <AlertModal
                visible={modalVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
    // Password Modal Start
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 13,
    },
    // Password Modal End

    // Contact Information Modal Start
    changeBtn: {
        position: 'absolute',
        right: 12,
        top: 13,
    },
    changeBtnText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        color: '#00A651',
        textDecorationLine: 'underline',
    },
    // Contact Information Modal End

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

    // 
    accWrap: {
        borderWidth: 1,
        borderColor: '#D7D7D7',
        borderRadius: 15,
        marginHorizontal: 16,
        paddingHorizontal: 20,
    },
    accBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7',
    },
    accIcon: {
        width: 27,
        height: 27,
        resizeMode: 'contain',
    },
    accRightIcon: {
        position: 'absolute',
        right: 0,
        top: 20,
    },
    accTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: '#777777',
    },
    proImgSec: {
        width: 110,
        height: 110,
        borderWidth: 5,
        borderColor: '#ffffff',
        borderRadius: 55,
        position: 'relative',
        margin: 'auto',
    },
    proImg: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
        resizeMode: 'cover',
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 36,
        height: 36,
        backgroundColor: '#00A651',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editImg: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    userName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        lineHeight: 26,
        color: '#000',
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 15,
    },
    userId: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#00A651',
        borderRadius: 25,
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 23,
    },
    // 

    // Header
    background: {
        flex: 1,
        width: '100%',
        paddingTop: 58,
        paddingBottom: 20,
    },
    flexdv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    arrowBox: {
        width: 32,
        height: 32,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#AFAFAF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color: '#000',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    notiDot: {
        width: 8,
        height: 8,
        backgroundColor: '#F82525',
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    // Header
    strengthWrapper: {
        height: 6,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        overflow: "hidden"
    },
    strengthBar: {
        height: "100%",
        borderRadius: 4
    },
    strengthLabel: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600"
    }
})