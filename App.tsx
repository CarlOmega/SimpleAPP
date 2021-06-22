import React from 'react';
import NavigationController from '@navigation/NavigationController';
import HomeNavigator from '@navigation/HomeNavigator';
import { AuthProvider, AuthContext } from '@states/AuthContext';
import AuthNavigator from '@navigation/AuthNavigator';
import { ActivityIndicator } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

const App = () => {

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
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
    </ApplicationProvider>
  );
};

export default App;
