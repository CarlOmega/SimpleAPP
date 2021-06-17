import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

const NavigationController = (props: any) => {
  return (
    <NavigationContainer 
      onReady={() => {
        // Can use to setup navigation events
      }}
      onStateChange={(state) => {
        // Can use to determine 
      }}
    >
      {props.children}
    </NavigationContainer>
  )
}

export default NavigationController;