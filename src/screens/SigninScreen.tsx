import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, Button, TextInput } from 'react-native';
import { useAuth } from '@states/AuthContext';

const SigninScreen = ({navigation, route}: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const onLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize={"none"}
        keyboardType={"email-address"}
        placeholder={"Email..."}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        autoCapitalize={"none"}
        placeholder={"Password..."}
      />
      <Button title={"Login"} onPress={onLogin}/>
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

export default SigninScreen;