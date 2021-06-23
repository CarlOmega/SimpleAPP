import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { RestaurantAPI } from '@utils/API';
import { Layout, Text, Input, Button } from '@ui-kitten/components';

const signupValidator = yup.object().shape({
  name: yup
    .string()
    .min(3)
    .max(30)
    .required('Name is Required'),
  description: yup
    .string()
    .required('Description is Required'),
})

const CreateScreen = ({ navigation, route }: any) => {

  const onCreate = async (values: any) => {
    console.log(values);
    try {
      await RestaurantAPI.create(values);
      navigation.goBack();
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderCaption = (caption: string | undefined) => (
    <Text status={"danger"} style={styles.captionText}>{caption ?? ""}</Text>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <Text category={"h1"} style={{ marginBottom: 50 }}>Create Restaurant</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ name: "", description: "" }}
          onSubmit={onCreate}
        >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
          <>
            <Input
              caption={() => renderCaption(touched.name ? errors.name : "")}
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={"Restaurant Name..."}
            />
            <Input
              textStyle={{ minHeight: 64 }}
              caption={() => renderCaption(touched.description ? errors.description : "")}
              style={styles.input}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              multiline
              value={values.description}
              placeholder={"Description..."}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid} onPress={handleSubmit} >
              Create
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
  captionText: {
    fontFamily: "Roboto",
    fontSize: 13
  },
  button: {
    width: "80%",
    borderRadius: 30,
    margin: 50,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  }
})

export default CreateScreen;