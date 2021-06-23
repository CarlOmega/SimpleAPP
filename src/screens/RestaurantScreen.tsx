import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Layout, List, Text, Icon } from '@ui-kitten/components';
import { useAuth } from '@states/AuthContext';
import { ReviewAPI } from '@utils/API';
import dayjs from 'dayjs';

const RestaurantScreen = ({ navigation, route }: any) => {
  const { claims } = useAuth();
  const [reviews, setReviews] = useState<Restaurant[]>([]);
  const [offset, setOffset] = useState(0);
  const restaurant: Restaurant = route.params.restaurant;

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const res = await ReviewAPI.read(restaurant.id, offset);
      if (res.data) {
        setReviews(prev => offset === 0 ? res.data : [...prev, ...res.data]);
        setOffset(offset + res.data.length);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderItemHeader = (headerProps: any, item: Review) => (
    <View {...headerProps}>
      <Layout style={{flexDirection: "row"}}>
        {[...Array(item.rating).keys()].map(() => 
          <Icon style={{width: 32, height: 32}} fill={'#121212'} name='star' />
        )}
      </Layout>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: Review) => (
    <Text {...footerProps}>
      {dayjs.unix(item.dateOfVisit).format("DD/MM/YYYY")}
    </Text>
  );

  const renderItem = ({ item, index, separators }: any) => (
    <Card
      onPress={() => console.log(item)}
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text>
        {item.comment}
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
    <Layout {...footerProps} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.text, { flex: 1, padding: 10 }]} >
        {restaurant.ratings == 0 ? "Unrated" : `Avg Rating: ${restaurant.avg}`}
      </Text>
      {claims?.user &&
        <Button style={{ flex: 1, padding: 10 }} onPress={() => navigation.navigate("Review", {restaurant})}>
          Review
        </Button>
      }
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
          onEndReached={(info: any) => getReviews()}
          onEndReachedThreshold={0.2}
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