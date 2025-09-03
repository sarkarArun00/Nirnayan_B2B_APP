import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/auth_service';
import { useGlobalAlert } from '../../../Context/GlobalAlertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';






function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [forgotModalVisible, setForgotModalVisible] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');

    const [resetPasswordModal, setResetPasswordModal] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const navigation = useNavigation();
    const [errors, setErrors] = useState({ email: '', password: '' });
    const { showAlertModal, hideAlert } = useGlobalAlert();



    const validateEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const handleLogin = async () => {
        let valid = true;
        let newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Enter a valid email address';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            try {
                const loginRequest = {
                    "emailOrMobile": email,
                    "user_pass": password
                }
                const response = await AuthService.empLogin(loginRequest);
                console.log('Login API Response: ', response)
                if (response?.access_token) {
                    await AsyncStorage.setItem("token", response.access_token);

                    await AsyncStorage.setItem("user_id", response.userData?.id?.toString() || '');
                    await AsyncStorage.setItem("user_name", response.userData?.client_name || '');
                    await AsyncStorage.setItem("user_email", response.userData?.email || '');

                    const lastLoginFormatted = formatLoginDate();
                    await AsyncStorage.setItem("lastLogin", lastLoginFormatted);

                    showAlertModal('Login Successful!', false);
                    setTimeout(() => {
                        hideAlert();
                        navigation.replace('AppTabs');
                    }, 1000)
                }
                else {
                    showAlertModal('Invalid email or password.', true);
                }
            } catch (error) {
                console.error("Login Error:", error);
                showAlertModal("Login Failed"+ "Invalid email or password. Please check your credentials and try again.", true);
            } finally {
                setLoginLoading(false); // End login loading
            }
        }
    };


    const formatLoginDate = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
      
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
      
        // Format time
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // convert 0 to 12
      
        return `${day} ${month} ${year}, at ${hours}:${minutes} ${ampm}`;
      };
      

      useEffect(() => {
        const backAction = () => true; // block
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
      }, []);
      
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground
                source={require('../../../assets/loginbg.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <Image source={require('../../../assets/logo1.png')} style={styles.logo} />

                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Smooth Access, Stronger Business</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: isEmailFocused ? '#00A651' : '#B2B2B2' },
                                ]}
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                keyboardType="email-address"
                                onFocus={() => setIsEmailFocused(true)}
                                onBlur={() => setIsEmailFocused(false)}
                            />
                            <Image
                                source={require('../../../assets/logicon.png')}
                                style={{ position: 'absolute', left: 15, top: 13 }}
                            />
                        </View>
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: isPasswordFocused ? '#00A651' : '#B2B2B2' },
                                ]}
                                placeholder="Password"
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            <Image
                                source={require('../../../assets/logicon2.png')}
                                style={{ position: 'absolute', left: 15, top: 13 }}
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                style={{ position: 'absolute', right: 15, top: 13 }}
                            >
                                <Icon
                                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#CECECE"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={styles.forgotPass}
                            onPress={() => setForgotModalVisible(true)}
                        >
                            <Image source={require('../../../assets/log-info.png')} />
                            <Text style={styles.forgotPassword}> Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={() => {handleLogin()}}>
                            <Image source={require('../../../assets/login.png')} />
                            <Text style={styles.loginText}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Forgot Password Modal */}
                <Modal
                    transparent={true}
                    visible={forgotModalVisible}
                    animationType="slide"
                    onRequestClose={() => setForgotModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setForgotModalVisible(false)}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Forgot Password?</Text>
                            <Text style={styles.modalSubtitle}>
                                Enter your mobile number to receive an OTP and {"\n"}reset your password
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Mobile Number"
                                    keyboardType="phone-pad"
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                />
                                <Image
                                    source={require('../../../assets/key.png')}
                                    style={{ position: 'absolute', left: 15, top: 13 }}
                                />
                            </View>

                            <TouchableOpacity style={styles.continueButton}>
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Reset Password Modal */}
                <Modal
                    transparent={true}
                    visible={resetPasswordModal}
                    animationType="slide"
                    onRequestClose={() => setResetPasswordModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setResetPasswordModal(false)}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Reset Password</Text>
                            <Text style={styles.modalSubtitle}>
                                Create and confirm your new password to ensure secure login to your account
                            </Text>

                            {/* Old Password */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'old' && { borderColor: '#00A651', borderWidth: 1 }
                                    ]}
                                    placeholder="Old Password"
                                    secureTextEntry
                                    onFocus={() => setFocusedInput('old')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <Image
                                    source={require('../../../assets/logicon2.png')}
                                    style={{ position: 'absolute', left: 15, top: 13 }}
                                />
                            </View>

                            {/* New Password */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'new' && { borderColor: '#00A651', borderWidth: 1 }
                                    ]}
                                    placeholder="New Password"
                                    secureTextEntry
                                    onFocus={() => setFocusedInput('new')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <Image
                                    source={require('../../../assets/logicon2.png')}
                                    style={{ position: 'absolute', left: 15, top: 13 }}
                                />
                            </View>

                            <TouchableOpacity style={styles.continueButton}>
                                <Text style={styles.continueText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

export default Login;

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 10,
    },

    background: {
        flex: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        marginHorizontal: 'auto',
        marginBottom: 35,
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        lineHeight: 26,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 15,
        color: '#949494',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        borderWidth: 1,
        color: '#949494',
        borderRadius: 10,
        height: 48,
        marginBottom: 14,
        paddingHorizontal: 15,
        paddingLeft: 50,
    },
    forgotPass: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    forgotPassword: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#060606',
    },
    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#00A651',
        width: '100%',
        padding: 16,
        borderRadius: 10,
    },
    loginText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 8,
    },

    // Modal
    modalOverlay: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 45,
        paddingBottom: 60,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    modalClose: {
        width: 23,
        height: 23,
        backgroundColor: '#000',
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -27,
        left: '50%',
        marginLeft: -11.5,
    },
    closeIcon: {
        fontSize: 11,
        color: '#fff',
    },
    modalTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color: '#535353',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        lineHeight: 13,
        color: '#535353',
        marginBottom: 15,
    },
    continueButton: {
        backgroundColor: '#00A651',
        width: '100%',
        padding: 16,
        borderRadius: 10,
    },
    continueText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },





    // Modal
});
