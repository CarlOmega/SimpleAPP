import React, { useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, Button, RefreshControl } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { useEffect } from 'react';
import { RestaurantAPI } from '@utils/API';

const HomeScreen = ({navigation, route}: any) => {
  const { user, login, logout, claims } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRestaurants().then(() => setRefreshing(false));
  }, []);

  
  const getRestaurants = async () => {
    try {
      const res = await RestaurantAPI.read();
      if (res.data)
        setRestaurants(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getRestaurants();
  }, [])

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error.message)
    }
  }

  const renderItem = ({ item, index, separators }: any) => {
    return <Text>{item.name}</Text>
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>Toptal</Text>
      {claims.owner && <Button title={"Create"} onPress={() => navigation.navigate("Create")}/>}
      <Button title={"Logout"} onPress={onLogout}/>
      <FlatList
        data={restaurants}
        keyExtractor={(restaurant: Restaurant) => restaurant.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={renderItem}
      />
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