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

import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BioAuthScreen = props => {
  const {navigation} = props;

  const checkBioAuth = () => {
    FingerprintScanner.isSensorAvailable()
      .then(resp => {
        console.log('FINGER', resp);
        activateBioAuth();
        FingerprintScanner.release();
      })
      .catch(err => {
        console.log('ERROR', err);
        FingerprintScanner.release();
      });
  };
  const activateBioAuth = () => {
    console.log('FUNC START');
    FingerprintScanner.authenticate({
      title: 'Активировать биометрическую аутентификацию?',
      cancelButton: 'Отмена',
    })
      .then(res => {
        console.log('BIO ACTIVE', res);
        setStore();
        navigation.navigate('MainScreen');
        FingerprintScanner.release();
      })
      .catch(err => {
        console.log('ACTIVATE FAIL', err);
        FingerprintScanner.release();
      });
  };
  const setStore = () => {
    AsyncStorage.setItem('isBioAuthActive', 'active')
      .then(resp => console.log('SUC', resp))
      .catch(err => console.log('ERR', err));
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Text style={{textAlign: 'center', fontSize: 18}}>
        Подключите биометрическую авторизацию, чтобы не вводить код доступа
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => checkBioAuth()}>
        <Text>Подключить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainScreen')}>
        <Text>Не подключать</Text>
      </TouchableOpacity>
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

export default BioAuthScreen;
