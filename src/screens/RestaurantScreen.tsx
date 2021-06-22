import React from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';

const RestaurantScreen = ({navigation, route}: any) => {
  const restaurant: Restaurant = route.params.restaurant;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>{restaurant.name}</Text>
      <Text style={styles.text}>{restaurant.description}</Text>
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

export default RestaurantScreen;