import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@screens/HomeScreen';
import CreateScreen from '@screens/CreateScreen';
import RestaurantScreen from '@screens/RestaurantScreen';

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home" >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Create" component={CreateScreen} />
      <HomeStack.Screen name="Restaurant" component={RestaurantScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;