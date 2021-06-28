import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { RestaurantAPI } from '@utils/API';
import { Layout, Text, Input, Button } from '@ui-kitten/components';

const signupValidator = yup.object().shape({
  name: yup
    .string()
    .min(3)
    .max(30),
  description: yup
    .string(),
})

const EditRestaurantScreen = ({ navigation, route }: any) => {
  const restaurant: Restaurant = route.params.restaurant;

  const onEdit = async (values: any) => {
    console.log(values);
    let changes: any = {};
    if (values.name !== "") changes["name"] = values.name;
    if (values.description !== "") changes["description"] = values.description;
    try {
      await RestaurantAPI.update(restaurant.id!, changes);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.message);
    }
  }

  const onDelete = () => {
    Alert.alert(
      `Delete ${restaurant.name}`,
      "Are you sure you would like to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "DELETE", 
          onPress: async () => {
            try {
              await RestaurantAPI.delete(restaurant.id!);
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

  const renderCaption = (caption: string | undefined) => (
    <Text status={"danger"} style={styles.captionText}>{caption ?? ""}</Text>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <Text category={"h1"} style={{ marginBottom: 50 }}>Edit Restaurant</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ name: "", description: "" }}
          onSubmit={onEdit}
        >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched, dirty }) => (
          <>
            <Input
              caption={() => renderCaption(touched.name ? errors.name : "")}
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={restaurant.name}
            />
            <Input
              textStyle={{ minHeight: 64 }}
              caption={() => renderCaption(touched.description ? errors.description : "")}
              style={styles.input}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              multiline
              value={values.description}
              placeholder={restaurant.description}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid && dirty} onPress={handleSubmit} >
              Save Changes
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

export default EditRestaurantScreen;