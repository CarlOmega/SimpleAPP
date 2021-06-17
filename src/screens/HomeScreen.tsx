import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Logo from '@assets/images/toptal.svg';

const HomeScreen = ({navigation, route}: any) => {

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Toptal</Text>
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