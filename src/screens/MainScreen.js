/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, Text} from 'react-native';

const MainScreen = props => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Text style={{textAlign: 'center', fontSize: 18}}>
        Поздравляем вы зашли!
      </Text>
    </View>
  );
};

export default MainScreen;
