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

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;


const Login = ({ navigation }: LoginProps) => {
  const { showSnackbar } = useSnackbar();

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>AppWrite Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        })}
        onSubmit={async values => {
          await account.createEmailPasswordSession(values.email, values.password)
            .then(async res => {
              await AsyncStorage.setItem('session', JSON.stringify(res));
              showSnackbar('You are logged in successfully.');
              navigation.replace('Home');
            })
            .catch(err => showSnackbar(err.message));
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            {/* Email Input */}
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Type something"
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
              placeholder="Type something"
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

            {/* Submit Button */}
            <TouchableOpacity onPress={() => handleSubmit()} >
              <Text style={styles.submitButton}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Text style={styles.doNotAccount}>
        Don't have an account?{' '}
        <Text style={styles.createAccount} onPress={() => navigation.replace('Registration')}>
          Create an account
        </Text>
      </Text>
    </View >
  );
};

export default Login;

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
  doNotAccount: {
    marginVertical: 20,
    textAlign: 'center',
  },
  createAccount: {
    color: '#df558f',
    fontWeight: 'bold',
  },
});
