/* eslint-disable react-native/no-inline-styles */

//Экран для проверки наличия авторизации

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

const WhiteScreen = props => {
  const {navigation} = props;

  //Проверяем, был ли уже осуществлен вход в приложение
  useEffect(() => {
    AsyncStorage.getItem('KeyChainActive')
      .then(res => {
        console.log('RES', res);
        if (res) {
          navigation.navigate('PincodeScreen');
        } else {
          navigation.navigate('LoginScreen');
        }
      })
      .catch(err => {
        console.log('CRED ERR', err);
      });
  }, [navigation]);

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
