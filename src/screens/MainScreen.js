/* eslint-disable react-native/no-inline-styles */
import {isEqual} from 'lodash';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

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

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
});

export default MainScreen;
