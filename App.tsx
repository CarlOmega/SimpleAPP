import React from 'react';
import NavigationController from '@navigation/NavigationController';
import HomeNavigator from '@navigation/HomeNavigator';
import { AuthProvider, AuthContext } from '@states/AuthContext';
import { View, Button, SafeAreaView } from 'react-native';

const App = () => {

  return (
    <AuthProvider>
      <NavigationController>
        <AuthContext.Consumer>
          {({user, login}) => 
            !user 
            ?
            <SafeAreaView>
              <Button title={"Login"} onPress={() => login("carl.w.humphries@gmail.com", "Test123")} />
            </SafeAreaView>
            :
            <HomeNavigator />
          }
        </AuthContext.Consumer>
      </NavigationController>
    </AuthProvider>
  );
};

export default App;
