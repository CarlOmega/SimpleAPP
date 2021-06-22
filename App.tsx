import React from 'react';
import NavigationController from '@navigation/NavigationController';
import HomeNavigator from '@navigation/HomeNavigator';
import { AuthProvider, AuthContext } from '@states/AuthContext';
import AuthNavigator from '@navigation/AuthNavigator';
import { ActivityIndicator } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const App = () => {

  return (
    <AuthProvider>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationController>
          <AuthContext.Consumer>
            {({ user, isLoading }) =>
              isLoading ? <ActivityIndicator /> :
                !user
                  ?
                  <AuthNavigator />
                  :
                  <HomeNavigator />
            }
          </AuthContext.Consumer>
        </NavigationController>
      </ApplicationProvider>
    </AuthProvider>

  );
};

export default App;
