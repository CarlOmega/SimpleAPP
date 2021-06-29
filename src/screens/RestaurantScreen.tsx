import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Layout, List, Text, Icon, Divider } from '@ui-kitten/components';
import { useAuth } from '@states/AuthContext';
import { ReviewAPI } from '@utils/API';
import dayjs from 'dayjs';

const RestaurantScreen = ({ navigation, route }: any) => {
  const { user, claims } = useAuth();
  const [reviews, setReviews] = useState<Restaurant[]>([]);
  const [preview, setPreview] = useState<any>(null)
  const offset = useRef(0);
  const isMounted = useRef(true);
  const restaurant: Restaurant = route.params.restaurant;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      offset.current = 0;
      getReviews()
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    }
  }, [navigation]);

  const getReviews = async () => {
    try {
      const res = await ReviewAPI.read(restaurant.id!, offset.current);
      if (res.data && isMounted.current) {
        setReviews(prev => offset.current === 0 ? res.data : [...prev, ...res.data]);
        offset.current += res.data.length;
      }
      const {data: preview} = await ReviewAPI.preview(restaurant.id!);
      if (preview && isMounted.current) {
        console.log(preview)
        setPreview(preview);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderItemHeader = (headerProps: any, item: Review) => (
    <View {...headerProps}>
      <Layout style={{ flexDirection: "row" }}>
        {[...Array(item.rating).keys()].map((index: number) =>
          <Icon key={index} style={{ width: 32, height: 32 }} fill={'#121212'} name='star' />
        )}
      </Layout>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: Review) => (
    <Layout {...footerProps} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.text, { flex: 1, padding: 10 }]} >
        {dayjs.unix(item.dateOfVisit).format("DD/MM/YYYY")}
      </Text>
      {claims?.owner  ?
        <Button style={{ flex: 1, padding: 10 }} onPress={() => navigation.navigate("Reply", { restaurant, review: item })}>
          {`${item.reply === "" ? "" : "Edit"} Reply`}
        </Button>
      : (claims?.admin && item.reply !== "" ? 
      <Button style={{ flex: 1, padding: 10 }} onPress={() => navigation.navigate("Reply", { restaurant, review: item })}>
        {`Edit Reply`}
      </Button> : null)}
    </Layout>
  );

  const renderItem = ({ item, index, separators }: { item: Review, index: number, separators: any }) => (
    <Card
      onPress={() => ((claims?.user && user.uid === item.author) || claims?.admin) ? 
        navigation.navigate("EditReview", { restaurant, review: item }) 
        : null
      }
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text>
        {item.comment}
      </Text>
      {item.reply !== "" && <>
        <Divider style={{ marginVertical: 10 }} />
        <Text>
          {item.reply}
        </Text>
      </>}
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
        {restaurant.ratings == 0 ? "Unrated" : `Avg Rating: ${restaurant.avg?.toFixed(2)}`}
      </Text>
      {claims?.user &&
        <Button style={{ flex: 1, padding: 10 }} onPress={() => navigation.navigate("Review", { restaurant })}>
          Review
        </Button>
      }
    </Layout>
  );

  const renderRestaurant = (props: any) => (
    <Card
      onPress={() => ((claims?.owner && user.uid === restaurant.owner) || claims?.admin) ? 
        navigation.navigate("EditRestaurant", { restaurant }) 
        : null
      }
      style={styles.restaurantContainer}
      status='basic'
      header={renderHeader}
      footer={renderFooter}>
      <Text style={[styles.text, {padding: 10, marginBottom: 10}]}>{restaurant.description}</Text>
      {preview && <>
        <Divider />
        <Text style={styles.text}>Highest Rating:</Text>
        <Layout style={{flexDirection: "row", height: 30, justifyContent: "center" }}>
          <Layout style={{ flex: 1, flexDirection: "row" }}>
            {[...Array(preview.top?.rating).keys()].map((index: number) =>
              <Icon key={index} style={{ width: 15, height: 15 }} fill={'#121212'} name='star' />
            )}
          </Layout>
          <Text style={[styles.text, {flex: 3}]}>{preview.top?.comment}</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>Lowest Rating:</Text>
        <Layout style={{ flexDirection: "row", height: 30, justifyContent: "center" }}>
          <Layout style={{ flex: 1, flexDirection: "row" }}>
            {[...Array(preview.bottom?.rating).keys()].map((index: number) =>
              <Icon key={index} style={{ width: 15, height: 15 }} fill={'#121212'} name='star' />
            )}
          </Layout>
          <Text style={[styles.text, {flex: 3}]} numberOfLines={1}>{preview.bottom?.comment}</Text>
        </Layout>
      </>}
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
          keyExtractor={(review: Review) => review.id!}
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