import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Layout, List, Text } from '@ui-kitten/components';
import { useAuth } from '@states/AuthContext';

const RestaurantScreen = ({ navigation, route }: any) => {
  const { claims } = useAuth();
  const [reviews, setReviews] = useState<Restaurant[]>([]);
  const restaurant: Restaurant = route.params.restaurant;

  const getReviews = async () => {

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
      {item.rating == 0 ? "Unrated" : item.rating}
    </Text>
  );

  const renderItem = ({ item, index, separators }: any) => (
    <Card
      onPress={() => navigation.navigate("Restaurant", {restaurant: item})}
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text numberOfLines={4}>
        {item.description}
      </Text>
    </Card>
  );

  const renderHeader = (headerProps: any) => (
    <View {...headerProps}>
      <Text style={styles.text} category='h6' numberOfLines={1}>
        {restaurant.name}
      </Text>
    </View>
  );

  const renderFooter = (footerProps: any) => (
    <Layout {...footerProps} style={{flexDirection: "row", justifyContent: "space-between"}}>
      <Text style={[styles.text, {flex: 1, padding: 10}]} >
        {restaurant.rating == 0 ? "Unrated" : `Avg Rating: ${restaurant.rating}`}
      </Text>
      {claims?.user ?<Button style={{flex:1, padding: 10}}>
        Review
      </Button> : null}
    </Layout>
  );

  const renderRestaurant = (props: any) => (
    <Card 
      style={styles.restaurantContainer}
      status='basic'
      header={renderHeader}
      footer={renderFooter}>
      <Text style={styles.text}>{restaurant.description}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <List
          style={styles.container}
          ListHeaderComponent={renderRestaurant}
          contentContainerStyle={styles.contentContainer}
          data={reviews}
          keyExtractor={(restaurant: Restaurant) => restaurant.id}
          renderItem={renderItem}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    width: "100%"
  },
  restaurantContainer: {
    width: "100%"
  },
  text: {
    fontFamily: "Roboto",
    textAlign: "center"
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
})

export default RestaurantScreen;