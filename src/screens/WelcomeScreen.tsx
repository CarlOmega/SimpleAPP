import { Layout, Text, Button } from '@ui-kitten/components';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const WelcomeScreen = ({navigation, route}: any) => {

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1' style={{marginBottom: 100}}>Welcome</Text>
        <Button style={styles.button} size={"giant"} appearance='outline' onPress={() => navigation.navigate("Signup", {type: "owner"})}>
          Owner Sign up
        </Button>
        <Button style={styles.button} size={"giant"} onPress={() => navigation.navigate("Signup", {type: "user"})}>
          User Sign up
        </Button>
        <Text style={styles.text}>
          Have an account? <Text style={styles.text} status='primary' onPress={() => navigation.navigate("Signin")}>Sign in</Text>
        </Text>
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  button: {
    margin: 5,
    borderRadius: 30,
    width: "90%"
  },
  text: {
    fontFamily: "Roboto",
    textAlign: "center"
  }
})

export default WelcomeScreen;