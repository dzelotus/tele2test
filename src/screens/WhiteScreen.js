/* eslint-disable react-native/no-inline-styles */

//Экран для проверки наличия авторизации
import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

const WhiteScreen = props => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Text style={{textAlign: 'center', fontSize: 18}}>
        Тестовое задание. Загрузка.
      </Text>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

export default WhiteScreen;
