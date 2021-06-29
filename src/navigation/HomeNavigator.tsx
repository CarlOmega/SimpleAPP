import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@screens/HomeScreen';
import CreateScreen from '@screens/CreateScreen';
import RestaurantScreen from '@screens/RestaurantScreen';
import ReviewScreen from '@screens/ReviewScreen';
import ReplyScreen from '@screens/ReplyScreen';
import PendingScreen from '@screens/PendingScreen';
import UsersScreen from '@screens/UsersScreen';
import EditRestaurantScreen from '@screens/EditRestaurantScreen';
import EditUserScreen from '@screens/EditUserScreen';

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home" >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Create" component={CreateScreen} />
      <HomeStack.Screen name="Restaurant" component={RestaurantScreen} />
      <HomeStack.Screen name="Review" component={ReviewScreen} />
      <HomeStack.Screen name="Pending" component={PendingScreen} />
      <HomeStack.Screen name="Reply" component={ReplyScreen} />
      <HomeStack.Screen name="Users" component={UsersScreen} />
      <HomeStack.Screen name="EditRestaurant" component={EditRestaurantScreen} />
      <HomeStack.Screen name="EditUser" component={EditUserScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;