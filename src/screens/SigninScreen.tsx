import React, {useState} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { Layout, Text, Input, Button } from '@ui-kitten/components';

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
      <Layout style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text category={"h1"} style={{marginBottom: 50}}>Login</Text>
        <Layout style={{width: "90%"}}>
          <Input
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            placeholder={"Email..."}
          />
          <Input
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            autoCapitalize={"none"}
            placeholder={"Password..."}
          />
          <Button style={styles.button} size={"giant"} onPress={onLogin}>Sign in</Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  input: {
    marginVertical: 10,
  },
  button: {
    margin: 5,
    borderRadius: 30
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20
  }
})

export default SigninScreen;