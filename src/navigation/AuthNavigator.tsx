import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SigninScreen from '@screens/SigninScreen';
import SignupScreen from '@screens/SignupScreen';
import WelcomeScreen from '@screens/WelcomeScreen';

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Welcome" >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
      <AuthStack.Screen name="Signin" component={SigninScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;