import React from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Logo from '@assets/images/toptal.svg';
import { useAuth } from '@states/AuthContext';

const HomeScreen = ({navigation, route}: any) => {
  const { user, login, logout } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Toptal</Text>
      <Text style={styles.text}>{user?.email ?? "Not logged in"}</Text>
      <Button title={"Logout"} onPress={onLogout}/>
      <Icon name="rocket" size={30} color="#900" />
      <Logo width={"100%"} height={"100%"}/>
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

export default HomeScreen;