import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Text, Layout, Input, Button, RadioGroup, Radio } from '@ui-kitten/components';
import { UserAPI } from '@utils/API';

const signupValidator = yup.object().shape({
  accountType: yup
    .string()
    .required(),
  email: yup
    .string()
    .email("Please enter valid email")
    .required('Email Address is Required'),
  userName: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters`)
    .required('Username is Required'),
});

const CreateUserScreen = ({ navigation, route }: any) => {

  const renderCaption = (caption: string | undefined) => (
    <Text status={"danger"} style={styles.captionText}>{caption ?? ""}</Text>
  );
  
  const onCreate = async (values: any) => {
    console.log(values);
    try {
      await UserAPI.create(values);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text category={"h1"} style={{marginBottom: 50}}>{"Admin Create User"}</Text>
        <Text category={"s1"}>{"Temporary password: Temp1234"}</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ accountType: "user", email: "", userName: "" }}
          onSubmit={onCreate}
        >{({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, values, errors, touched }) => (
          <>
          <RadioGroup
            selectedIndex={values.accountType === "user" ? 0 : 1}
            onChange={index => setFieldValue('accountType', index === 0 ? "user" : "owner")}>
            <Radio>User</Radio>
            <Radio>Owner</Radio>
          </RadioGroup>
            <Input
              caption={() => renderCaption(touched.userName ? errors.userName : "")}
              style={styles.input}
              onChangeText={handleChange('userName')}
              onBlur={handleBlur('userName')}
              value={values.userName}
              placeholder={"Username..."}
            />
            <Input
              onChangeText={handleChange('email')}
              style={styles.input}
              caption={() => renderCaption(touched.email ? errors.email : "")}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              placeholder={"Email..."}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid} onPress={handleSubmit}>
              {`Create ${values.accountType}`}
            </Button>
          </>
        )}</Formik>
      </Layout>
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
  button: {
    width: "80%",
    borderRadius: 30,
    margin: 10,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  },
  captionContainer: {
    alignItems: 'center',
  },
  captionText: {
    fontFamily: "Roboto",
    fontSize: 13
  }
})

export default CreateUserScreen;