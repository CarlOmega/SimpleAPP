import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, TextInput } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';

const signupValidator = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required('Email Address is Required'),
  userName: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters`)
    .required('Username is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
})

const SignupScreen = ({ navigation, route }: any) => {
  const type = route.params.type;
  const { createAccount } = useAuth();

  const onSignup = async (values: any) => {
    console.log(values);
    try {
      const user: User = {
        accountType: type,
        email: values.email,
        userName: values.userName
      };

      await createAccount(user, values.password);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Sign up {type}</Text>
      <Formik
        validationSchema={signupValidator}
        initialValues={{ email: "", password: "", userName: "" }}
        onSubmit={onSignup}
      >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
        <>
          {(errors.userName && touched.userName) &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.userName}</Text>
          }
          <TextInput
            style={styles.input}
            onChangeText={handleChange('userName')}
            onBlur={handleBlur('userName')}
            value={values.userName}
            placeholder={"Username..."}
          />
          {(errors.email && touched.email) &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
          }
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            placeholder={"Email..."}
          />
          {(errors.password && touched.password) &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
          }
          <TextInput
            style={styles.input}
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            autoCapitalize={"none"}
            placeholder={"Password..."}
          />
          <Button title={"Create Account"} disabled={!isValid} onPress={handleSubmit} />
        </>
      )}</Formik>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  }
})

export default SignupScreen;