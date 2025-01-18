import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import account from '../auth/appWrite';
import { useSnackbar } from '../contexts/SnackbarContext';

type RegistrationProps = NativeStackScreenProps<RootStackParamList, 'Registration'>;

const Registration = ({ navigation }: RegistrationProps) => {
    const { showSnackbar } = useSnackbar();

    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>AppWrite Registration</Text>

            <Formik
                initialValues={{ userName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={Yup.object({
                    userName: Yup.string()
                        .min(3, 'Username must be at least 3 characters')
                        .required('Username is required'),
                    email: Yup.string()
                        .email('Invalid email format')
                        .required('Email is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password')], 'Passwords must match')
                        .required('Confirm Password is required'),
                })}
                onSubmit={async values => {
                    await account.create(new Date().getTime().toString(), values.email, values.password, values.userName)
                        .then(async res => {
                            await AsyncStorage.setItem('session', JSON.stringify(res));
                            showSnackbar('You are registered successfully.');
                            navigation.navigate('Home');
                        })
                        .catch(err => showSnackbar(err.message));
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        {/* Username Input */}
                        <TextInput
                            mode="outlined"
                            label="Username"
                            placeholder="Enter your username"
                            style={styles.input}
                            value={values.userName}
                            onChangeText={handleChange('userName')}
                            onBlur={handleBlur('userName')}
                            error={touched.userName && !!errors.userName}
                            maxLength={50}
                            right={<TextInput.Affix text={`${50 - values.userName.length}`} />}
                        />
                        {touched.userName && errors.userName && (
                            <Text style={styles.errorText}>{errors.userName}</Text>
                        )}

                        {/* Email Input */}
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Enter your email"
                            style={styles.input}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={touched.email && !!errors.email}
                            maxLength={50}
                            right={<TextInput.Affix text={`${50 - values.email.length}`} />}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}

                        {/* Password Input */}
                        <TextInput
                            mode="outlined"
                            label="Password"
                            style={styles.input}
                            placeholder="Enter your password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={touched.password && !!errors.password}
                            maxLength={50}
                            secureTextEntry
                            right={<TextInput.Affix text={`${50 - values.password.length}`} />}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}

                        {/* Confirm Password Input */}
                        <TextInput
                            mode="outlined"
                            label="Confirm Password"
                            style={styles.input}
                            placeholder="Confirm your password"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={touched.confirmPassword && !!errors.confirmPassword}
                            maxLength={50}
                            secureTextEntry
                            right={<TextInput.Affix text={`${50 - values.confirmPassword.length}`} />}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity onPress={() => handleSubmit()}>
                            <Text style={styles.submitButton}>Register</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <Text style={styles.haveAccount}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={() => navigation.replace('Login')}>
                    Login
                </Text>
            </Text>
        </View >
    );
};

export default Registration;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderColor: 'red',
        borderWidth: 3,
        borderRadius: 5,
    },
    headingText: {
        marginVertical: 20,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#df558f',
    },
    form: {
        margin: 10,
    },
    input: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginVertical: 5,
    },
    submitButton: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#df558f',
        paddingVertical: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    haveAccount: {
        marginVertical: 20,
        textAlign: 'center',
    },
    loginLink: {
        color: '#df558f',
        fontWeight: 'bold',
    },
});
