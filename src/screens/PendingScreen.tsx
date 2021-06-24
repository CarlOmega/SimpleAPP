import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Layout, List, Text, Icon, Divider } from '@ui-kitten/components';
import { useAuth } from '@states/AuthContext';
import dayjs from 'dayjs';

const PendingScreen = ({ navigation, route }: any) => {
  const { claims } = useAuth();
  const reviews = route.params.pending;

  const renderItemHeader = (headerProps: any, item: Review) => (
    <View {...headerProps}>
      <Layout style={{ flexDirection: "row" }}>
        {[...Array(item.rating).keys()].map(() =>
          <Icon style={{ width: 32, height: 32 }} fill={'#121212'} name='star' />
        )}
      </Layout>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: Review) => (
    <Layout {...footerProps} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.text, { flex: 1, padding: 10 }]} >
        {dayjs.unix(item.dateOfVisit).format("DD/MM/YYYY")}
      </Text>
      {claims?.owner && item.reply === "" &&
        <Button style={{ flex: 1, padding: 10 }} onPress={() => navigation.navigate("Reply", { review: item })}>
          Reply
        </Button>
      }
    </Layout>
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
      {item.reply !== "" && <>
        <Divider style={{ marginVertical: 10 }} />
        <Text>
          {item.reply}
        </Text>
      </>}
    </Card>
  );



  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <List
          style={styles.container}
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

export default PendingScreen;