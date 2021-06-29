import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Text, Layout, Icon, Input, Button, Divider } from '@ui-kitten/components';
import { UserAPI } from '@utils/API';

const signupValidator = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email"),
  userName: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters`),
})

const EditUserScreen = ({ navigation, route }: any) => {
  const user: any = route.params.user;

  const renderCaption = (caption: string | undefined) => (
    <Text status={"danger"} style={styles.captionText}>{caption ?? ""}</Text>
  );
  
  const onEdit = async (values: any) => {
    console.log(values);
    let changes: any = {};
    if (values.userName !== "") changes["userName"] = values.userName;
    if (values.email !== "") changes["email"] = values.email;
    try {
      await UserAPI.update(user.uid, {user: changes});
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.message);
    }
  }

  const onDelete = () => {
    Alert.alert(
      `Delete ${user.displayName}`,
      "Are you sure you would like to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "DELETE", 
          onPress: async () => {
            try {
              await UserAPI.delete(user.uid);
              navigation.navigate("Home");
            } catch (error) {
              console.log(error.message);
            }
          },
          style: "destructive"
        }
      ]
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text category={"h1"} style={{marginBottom: 50}}>{user.displayName}</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ email: "", userName: "" }}
          onSubmit={onEdit}
        >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched, dirty }) => (
          <>
            <Input
              caption={() => renderCaption(touched.userName ? errors.userName : "")}
              style={styles.input}
              onChangeText={handleChange('userName')}
              onBlur={handleBlur('userName')}
              value={values.userName}
              placeholder={user.displayName}
            />
            <Input
              onChangeText={handleChange('email')}
              style={styles.input}
              caption={() => renderCaption(touched.email ? errors.email : "")}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              placeholder={user.email}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid || !dirty} onPress={handleSubmit}>
              Edit Account
            </Button>
          </>
        )}</Formik>
        <Button style={styles.button} status={"danger"} size={"giant"} onPress={onDelete} >
          Delete
        </Button>
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

export default EditUserScreen;