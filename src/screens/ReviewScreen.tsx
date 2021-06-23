import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
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
    .min(1)
    .max(5)
    .required('Rating is Required'),
  comment: yup
    .string()
    .required('Comment is Required'),
  dateOfVisit: yup
    .date()
    .required('Date is Required'),
})

const ReviewScreen = ({ navigation, route }: any) => {
  const restaurant: Restaurant = route.params.restaurant;

  const onReview = async (values: any) => {    
    try {
      await ReviewAPI.create(restaurant.id, {comment: values.comment, rating: values.rating, dateOfVisit: dayjs(values.dateOfVisit).unix()});
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
        <Text category={"h5"} style={{ marginBottom: 50, marginTop: 20 }}>{restaurant.name}</Text>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ rating: 3, comment: "", dateOfVisit: dayjs().toDate() }}
          onSubmit={onReview}
        >{({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, values, errors, touched }) => (
          <>
            <Layout style={{flexDirection: "row"}}>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 1 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 1)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 2 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 2)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 3 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 3)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 4 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 4)}/>
              <Icon style={{width: 32, height: 32}} fill={values.rating >= 5 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setFieldValue('rating', 5)}/>
            </Layout>
            <DateTimePicker
                style={{width: "100%", alignContent: "center"}}
                value={values.dateOfVisit}
                mode={"date"}
                display="default"
                onChange={(e: any, date: Date | undefined) => setFieldValue("dateOfVisit", date)}
              />
            <Input
              textStyle={{ minHeight: 64 }}
              caption={() => renderCaption(touched.comment ? errors.comment : "")}
              style={styles.input}
              onChangeText={handleChange('comment')}
              onBlur={handleBlur('comment')}
              multiline
              value={values.comment}
              placeholder={"Comment..."}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid} onPress={handleSubmit} >
              Review
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

export default ReviewScreen;