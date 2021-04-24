import React, {useEffect, useState} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import PinCodeScreen from './screens/PincodeScreen';
import BioAuthScreen from './screens/BioAuthScreen';
import MainScreen from './screens/MainScreen';
import WhiteScreen from './screens/WhiteScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WhiteScreen"
        component={WhiteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PincodeScreen"
        component={PinCodeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BioAuthScreen"
        component={BioAuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
