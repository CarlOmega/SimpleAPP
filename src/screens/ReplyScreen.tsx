import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ReviewAPI } from '@utils/API';
import { Layout, Text, Input, Button, Divider } from '@ui-kitten/components';
import { ScrollView } from 'react-native';

const signupValidator = yup.object().shape({
  reply: yup
    .string()
    .max(120)
    .required('Comment is Required'),
})

const ReplyScreen = ({ navigation, route }: any) => {
  const review: Review = route.params.review;

  const onReply = async (values: any) => {    
    try {
      review.reply = values.reply;
      await ReviewAPI.update(review.restaurantId, review.id, values.reply);
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
        <Text category={"h5"} style={{ marginBottom: 50, marginTop: 20 }}>Comment Details</Text>
        <Divider />
        <Text category={"s1"} >{"Rating: " + review.rating}</Text>
        <Divider />
        <ScrollView style={{maxHeight: 100, width: "100%", backgroundColor: "#fefefe"}}>
          <Text style={{ margin: 10 }} >{review.comment}</Text>
        </ScrollView>
        <Formik
          validationSchema={signupValidator}
          initialValues={{ reply: "" }}
          onSubmit={onReply}
        >{({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
          <>
            <Input
              textStyle={{ minHeight: 64 }}
              caption={() => renderCaption(touched.reply ? errors.reply : "")}
              style={styles.input}
              onChangeText={handleChange('reply')}
              onBlur={handleBlur('reply')}
              multiline
              value={values.reply}
              placeholder={"Reply..."}
            />
            <Button style={styles.button} size={"giant"} disabled={!isValid} onPress={handleSubmit} >
              Reply
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

export default ReplyScreen;