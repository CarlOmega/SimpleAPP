import React from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';

const WelcomeScreen = ({navigation, route}: any) => {

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Welcome</Text>
      <Button title={"Owner Sign up"} onPress={() => navigation.navigate("Signup", {type: "owner"})}/>
      <Button title={"User Sign up"} onPress={() => navigation.navigate("Signup", {type: "user"})}/>
      <Button title={"Have an account? Sign in"} onPress={() => navigation.navigate("Signin")}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20,
    textAlign: "center"
  }
})

export default WelcomeScreen;