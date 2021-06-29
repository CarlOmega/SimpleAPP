import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ReviewAPI } from '@utils/API';
import { Layout, Text, Input, Button, ButtonGroup, Icon } from '@ui-kitten/components';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';

const signupValidator = yup.object().shape({
  rating: yup
    .number()
    .integer()
    .min(0)
    .max(5),
  comment: yup
    .string()
    .max(120),
})

const EditReviewScreen = ({ navigation, route }: any) => {
  const restaurant: Restaurant = route.params.restaurant;
  const review: Review = route.params.review;

  
  const onEdit = async (values: any) => {
    console.log(values);
    let changes: any = {};
    if (values.rating !== 0) changes["rating"] = values.rating;
    if (values.comment !== "") changes["comment"] = values.comment;
    try {
      await ReviewAPI.update(restaurant.id!, review.id!, changes);
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
              await ReviewAPI.delete(restaurant.id!, review.id!);
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
        <Text category={"h5"} style={{ marginBottom: 50, marginTop: 20 }}>{restaurant.name}</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ rating: 0, comment: "" }}
          onSubmit={onEdit}
        >{({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, values, errors, touched, dirty }) => (
          <>
            <Layout style={{flexDirection: "row"}}>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 1 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 1)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 2 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 2)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 3 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 3)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 4 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 4)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 5 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 5)}/>
            </Layout>
            <Input
              textStyle={{ minHeight: 64 }}
              caption={() => renderCaption(touched.comment ? errors.comment : "")}
              style={styles.input}
              onChangeText={handleChange('comment')}
              onBlur={handleBlur('comment')}
              multiline
              value={values.comment}
              placeholder={review.comment}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid || !dirty} onPress={handleSubmit} >
              Edit Review
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
  buttonGroup: {
    margin: 2,
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

export default EditReviewScreen;