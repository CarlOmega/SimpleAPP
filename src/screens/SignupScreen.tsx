import React from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';
import { useAuth } from '@states/AuthContext';

const SignupScreen = ({navigation, route}: any) => {
  const type = route.params.type;
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>{type}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  }
})

export default SignupScreen;