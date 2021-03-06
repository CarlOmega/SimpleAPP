import React, { useState, useCallback, useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl, View, Button as NativeButton } from 'react-native';
import { useAuth } from '@states/AuthContext';
import { useEffect } from 'react';
import { RestaurantAPI, ReviewAPI } from '@utils/API';
import { Card, Text, List, Button, Icon, Layout } from '@ui-kitten/components';
import { useRef } from 'react';

const HomeScreen = ({ navigation, route }: any) => {
  const { user, login, logout, claims } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pending, setPending] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const offset = useRef(0);
  const isMounted = useRef(true);

  const onRefresh = () => {
    setRefreshing(true);
    offset.current = 0;
    if (claims?.owner) getPending();
    getRestaurants().then(() => setRefreshing(false));
  }

  const getRestaurants = async () => {
    try {
      const res = await RestaurantAPI.read(offset.current);
      if (res.data && isMounted.current) {
        console.log(res.data);
        setRestaurants(prev => offset.current === 0 ? res.data : [...prev, ...res.data]);
        offset.current += res.data.length;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getPending = async () => {
    try {
      const res = await ReviewAPI.pending();
      if (res.data && isMounted.current) {
        setPending([...res.data]);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (claims?.owner) getPending();
  }, [claims]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      offset.current = 0;
      getRestaurants();
      if (claims?.owner) getPending();
    });

    return () => {
      unsubscribe();
    }
  }, [navigation, claims]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

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
      {item.ratings == 0 ? "Unrated" : item.avg!.toFixed(2)}
    </Text>
  );

  const renderItem = ({ item, index, separators }: any) => (
    <Card
      onPress={() => navigation.navigate("Restaurant", { restaurant: item })}
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text numberOfLines={4} style={{ fontFamily: "Roboto", minHeight: 50 }}>
        {item.description}
      </Text>
    </Card>
  );

  useEffect(() => {

    console.log("pending")
    navigation.setOptions({
      headerRight: () => (
        claims?.owner ? (
        <Layout style={{ paddingRight: 10, paddingTop: 5 }}>
          {pending.length !== 0 && <Layout style={styles.badge}>
            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 10, color: "white"}}>{pending.length}</Text>
          </Layout>}
          <Icon
            onPress={() => navigation.navigate("Pending", {pending})}
            style={{ width: 40, height: 40 }}
            fill='#121212'
            name='alert-circle-outline'
          />
        </Layout>
        ) :
        (claims?.admin && 
        <Layout style={{ paddingRight: 10, paddingTop: 5 }}>
          <Icon
            onPress={() => navigation.navigate("Users")}
            style={{ width: 40, height: 40 }}
            fill='#121212'
            name='people-outline'
          />
        </Layout>)
      ),
      headerLeft: () => (
        <NativeButton onPress={onLogout} title="Logout" />
      ),
    });
  }, [navigation, claims, pending]);

  const renderHeader = () => (
    <>
    <Layout style={{flexDirection: "row", alignItems: "center"}}>
      <Text category={"h5"}>Filter:</Text>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 1 ? '#121212' : '#8F9BB3'} name='close-circle-outline' onPress={() => setRatingFilter(0)}/>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 1 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setRatingFilter(1)}/>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 2 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setRatingFilter(2)}/>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 3 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setRatingFilter(3)}/>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 4 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setRatingFilter(4)}/>
      <Icon style={{width: 32, height: 32}} fill={ratingFilter >= 5 ? '#121212' : '#8F9BB3'} name='star' onPress={() => setRatingFilter(5)}/>
    </Layout>
    {claims?.owner ? <Button style={{ borderRadius: 20, marginVertical: 10 }} onPress={() => navigation.navigate("Create")}>Add New Restaurant</Button> : null}
    </>
  )

  return (
    <SafeAreaView style={styles.screen}>
      <List
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={restaurants.filter((restaurant: Restaurant) => (restaurant.avg ?? 0) >= ratingFilter)}
        ListHeaderComponent={renderHeader}
        onEndReached={(info: any) => getRestaurants()}
        onEndReachedThreshold={0.2}
        keyExtractor={(restaurant: Restaurant) => restaurant.id!}
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
  badge: { 
    position: "absolute",
    justifyContent: "center",
    zIndex: 10, 
    backgroundColor: "red", 
    width: 20, 
    height: 20, 
    right: 9, 
    borderRadius: 10
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