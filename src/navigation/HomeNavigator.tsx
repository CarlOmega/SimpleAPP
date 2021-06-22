import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@screens/HomeScreen';
import CreateScreen from '@screens/CreateScreen';

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home" >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Create" component={CreateScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;