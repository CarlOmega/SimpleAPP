import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@screens/HomeScreen';

const RootStack = createStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Home" >
      <RootStack.Screen name="Home" component={HomeScreen} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;