import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Button, RefreshControl, View } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { useEffect } from 'react';
import { RestaurantAPI } from '@utils/API';
import { Card, Text, List } from '@ui-kitten/components';
import { useRef } from 'react';

const HomeScreen = ({navigation, route}: any) => {
  const { user, login, logout, claims } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const offset = useRef(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    offset.current = 0;
    getRestaurants().then(() => setRefreshing(false));
  }, []);

  const getRestaurants = async () => {
    try {
      const res = await RestaurantAPI.read(offset.current);
      if (res.data) {
        setRestaurants(prev => offset.current === 0 ? res.data : [...prev, ...res.data]);
        offset.current += res.data.length;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      offset.current = 0;
      getRestaurants()
    });

    return unsubscribe;
  }, [navigation]);

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error.message)
    }
  }

  const renderItemHeader = (headerProps: any, item: Restaurant) => (
    <View {...headerProps}>
      <Text category='h6' numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: Restaurant) => (
    <Text {...footerProps}>
      {item.ratings == 0 ? "Unrated" : item.avg}
    </Text>
  );

  const renderItem = ({ item, index, separators }: any) => (
    <Card
      onPress={() => navigation.navigate("Restaurant", {restaurant: item})}
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text numberOfLines={4} style={{fontFamily: "Roboto", minHeight: 50}}>
        {item.description}
      </Text>
    </Card>
  );


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        claims?.owner ? <Button onPress={() => navigation.navigate("Create")} title="Add" /> : null
      ),
      headerLeft: () => (
       <Button onPress={onLogout} title="Logout" />
      ),
    });
  }, [navigation, claims]);

  return (
    <SafeAreaView style={styles.screen}>
      <List
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={restaurants}
        onEndReached={(info: any) => getRestaurants()}
        onEndReachedThreshold={0.2}
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
  },
  container: {
    height: "100%"
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
})

export default HomeScreen;