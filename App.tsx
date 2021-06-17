import React from 'react';
import NavigationController from '@navigation/NavigationController';
import RootNavigator from '@navigation/RootNavigator';

const App = () => {

  return (
    <NavigationController>
      <RootNavigator />
    </NavigationController>
  );
};

export default App;
