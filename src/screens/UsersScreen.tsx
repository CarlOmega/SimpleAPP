import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Layout, List, Text, Icon, Divider } from '@ui-kitten/components';
import { useAuth } from '@states/AuthContext';
import dayjs from 'dayjs';
import { UserAPI } from '@utils/API';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const UsersScreen = ({ navigation, route }: any) => {
  const { claims } = useAuth();
  const [users, setUsers] = useState([]);
  const isMounted = useRef(true);

  const getUsers = async () => {
    try {
      const res = await UserAPI.read();
      if (res.data && isMounted.current) {
        console.log(res.data)
        setUsers(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUsers();
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    }
  }, [navigation]);

  const renderItemHeader = (headerProps: any, item: any) => (
    <View {...headerProps}>
      <Text style={styles.text} category='h6' numberOfLines={1}>
        {item.displayName}
      </Text>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: any) => (
    <Layout {...footerProps} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.text, { flex: 1, padding: 10 }]} >
        {item.uid}
      </Text>
    </Layout>
  );

  const renderItem = ({ item, index, separators }: any) => (
    <Card
      onPress={() => navigation.navigate("EditUser", {user: item})}
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, item)}
      footer={footerProps => renderItemFooter(footerProps, item)}>
      <Text>
        {item.email}
      </Text>
    </Card>
  );

  const renderHeader = () => (
    <>
    {claims?.admin ? <Button style={{ borderRadius: 20, marginVertical: 10 }} onPress={() => navigation.navigate("CreateUser")}>Add New User</Button> : null}
    </>
  )

  return (
    <SafeAreaView style={styles.screen}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <List
          style={styles.container}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.contentContainer}
          data={users}
          keyExtractor={(data: any, index: number) => `${index}`}
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

export default UsersScreen;