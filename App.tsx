import React from 'react';
import NavigationController from '@navigation/NavigationController';
import RootNavigator from '@navigation/RootNavigator';
import { AuthProvider } from '@states/AuthContext';

const App = () => {

  return (
    <AuthProvider>
      <NavigationController>
        <RootNavigator />
      </NavigationController>
    </AuthProvider>
  );
};

export default App;
