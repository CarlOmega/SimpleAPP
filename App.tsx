import React from 'react';
import NavigationController from '@navigation/NavigationController';
import HomeNavigator from '@navigation/HomeNavigator';
import { AuthProvider, AuthContext } from '@states/AuthContext';
import AuthNavigator from '@navigation/AuthNavigator';
import { ActivityIndicator } from 'react-native';

const App = () => {

  return (
    <AuthProvider>
      <NavigationController>
        <AuthContext.Consumer>
          {({user, isLoading}) => 
            isLoading ? <ActivityIndicator /> :
            !user 
            ?
            <AuthNavigator />
            :
            <HomeNavigator />
          }
        </AuthContext.Consumer>
      </NavigationController>
    </AuthProvider>
  );
};

export default App;
