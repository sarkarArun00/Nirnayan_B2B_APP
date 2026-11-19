import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSession = async () => {
    const keys = [
        'token', 'centreId', 'loginType', 'success',
        'loginMessage', 'PASSWORD_EXPIRED_IN', 'userData',
    ];

    const pairs = await AsyncStorage.multiGet(keys);
    const s = Object.fromEntries(pairs);

    return {
        token: s.token,
        centreId: s.centreId ? Number(s.centreId) : null,
        loginType: s.loginType,
        success: s.success === 'true',
        message: s.loginMessage,
        passwordExpiresInDays: Number(s.PASSWORD_EXPIRED_IN) || 0,
        userData: s.userData ? JSON.parse(s.userData) : null,
    };
};

export const clearSession = async () => {
    await AsyncStorage.multiRemove([
        'token', 'centreId', 'loginType', 'success', 'loginMessage',
        'PASSWORD_EXPIRED_IN', 'userData', 'user_id', 'user_name',
        'user_email', 'lastLogin',
    ]);
};