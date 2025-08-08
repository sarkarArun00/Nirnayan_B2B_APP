import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

function ResetPassword() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.resPassword}>
            <View>
                <Text style={styles.resTitle}>Reset Your Password</Text>
                <Text style={styles.resSubTitle}>
                    We have sent you a 6 digit {"\n"}code on your mobile number
                </Text>

                <View style={styles.textInput}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputs.current[index] = ref}
                            style={[
                                styles.input,
                                focusedIndex === index && styles.inputFocused
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={value}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            textAlign="center"
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => setFocusedIndex(null)}
                        />
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                    <Text style={styles.time}>05:00</Text>
                    <Text style={styles.resendCode}> Resend Code?</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.otp}>OTP Sent Successfully</Text>
            </View>
        </View>
    );
}

export default ResetPassword;

const styles = StyleSheet.create({
    resPassword: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 85,
        paddingHorizontal: 16,
    },
    resTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        lineHeight: 22,
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    resSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 17,
        color: '#A1A1A1',
        textAlign: 'center',
        marginBottom: 40,
    },
    otp: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    time: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#9E9D9D',
    },
    resendCode: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#00A651',
    },
    textInput: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 80,
    },
    input: {
        fontFamily: 'Poppins-SemiBold',
        width: 44,
        height: 52,
        borderWidth: 1,
        borderColor: '#B2B2B2',
        borderRadius: 8,
        fontSize: 18,
    },
    inputFocused: {
        borderColor: '#00A651',
    },
});
