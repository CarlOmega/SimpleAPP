import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, TextInput } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { RestaurantAPI } from '@utils/API';

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

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Create Restaurant</Text>
      <Formik
        validationSchema={signupValidator}
        initialValues={{ name: "", description: "" }}
        onSubmit={onCreate}
      >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
        <>
          {(errors.name && touched.name) &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>
          }
          <TextInput
            style={styles.input}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            placeholder={"Restaurant Name..."}
          />
          {(errors.description && touched.description) &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.description}</Text>
          }
          <TextInput
            style={styles.input}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            value={values.description}
            placeholder={"Description..."}
          />
          <Button title={"Create Restaurant"} disabled={!isValid} onPress={handleSubmit} />
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

export default CreateScreen;