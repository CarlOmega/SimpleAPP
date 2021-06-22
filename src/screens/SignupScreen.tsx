import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Text, Layout, Icon, Input, Button, Divider } from '@ui-kitten/components';

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
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderCaption = (caption: string | undefined) => (
    <Text status={"danger"} style={styles.captionText}>{caption ?? ""}</Text>
  );

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
      <Layout style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text category={"h1"} style={{marginBottom: 50}}>{type[0].toUpperCase() + type.slice(1)}</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ email: "", password: "", userName: "" }}
          onSubmit={onSignup}
        >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
          <Layout style={{width: "90%"}}>
            <Input
              caption={() => renderCaption(touched.userName ? errors.userName : "")}
              onChangeText={handleChange('userName')}
              onBlur={handleBlur('userName')}
              value={values.userName}
              placeholder={"Username..."}
            />
            <Input
              onChangeText={handleChange('email')}
              caption={() => renderCaption(touched.email ? errors.email : "")}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              placeholder={"Email..."}
            />
            <Input
              value={values.password}
              placeholder='Password...'
              caption={() => renderCaption(touched.password ? errors.password : "")}
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid} onPress={handleSubmit}>
              Create Account
            </Button>
          </Layout>
        )}</Formik>
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  button: {
    borderRadius: 30,
    margin: 5
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  },
  captionContainer: {
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5
  },
  captionText: {
    fontFamily: "Roboto",
    fontSize: 13
  }
})

export default SignupScreen;