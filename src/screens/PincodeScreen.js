/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
'use-strict';
import {isEqual} from 'lodash';
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const rightCombination = {
  login: 'test',
  password: 'test',
};

const PinCodeScreen = props => {
  console.log('LOGIN PROPS', props);

  const {navigation} = props;

  //начальное состояние для точек, которые показывают ввод символов пин-кода
  const initialDotsState = [
    {id: 1, colored: false},
    {id: 2, colored: false},
    {id: 3, colored: false},
    {id: 4, colored: false},
  ];

  //устанавливаем стейты
  const [pinStatus, setPinstatus] = useState('choose');
  const [pinCodeInput, setPinCodeInput] = useState('');
  const [pinCode, setPinCode] = useState(null);
  const [storedPin, setStoredPin] = useState(null);
  const [dots, setDots] = useState(initialDotsState);
  const [isBioAuthActive, setIsBioAuthActive] = useState(null);

  const cancel = pinStatus === 'confirm' ? 'Отмена' : storedPin ? 'Выход' : '';
  const deleteSymbol = pinCodeInput.length
    ? 'Удалить'
    : isBioAuthActive
    ? 'Палец'
    : '';

  console.log('BIO AUTH', isBioAuthActive);

  //массив для рендера пин-пада
  const lines = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [cancel, '0', deleteSymbol],
  ];

  useEffect(() => {
    /* AsyncStorage.removeItem('isBioAuthActive');
    AsyncStorage.removeItem('PinCode'); */
    checkPinCode();
    checkBioAuth();
    if (isBioAuthActive) {
      enterWithBioAuth();
    }
  }, [isBioAuthActive]);

  const successLogin = () => {
    console.log('CHECK START', isBioAuthActive);
    Keychain.getGenericPassword().then(response => {
      const keychainCombination = {
        login: response.username,
        password: response.password,
      };
      console.log('GET GEN', keychainCombination, rightCombination);
      if (isEqual(keychainCombination, rightCombination)) {
        if (isBioAuthActive) {
          navigation.navigate('MainScreen');
        } else {
          navigation.navigate('BioAuthScreen');
        }
      } else {
        Alert.alert('Ошибка');
        navigation.navigate('LoginScreen');
      }
    });
  };

  if (pinCodeInput === storedPin) {
    successLogin();
  } else if (pinCodeInput.length === 4 && !pinCode) {
    setPinstatus('confirm');
    setPinCode(pinCodeInput);
    setPinCodeInput('');
    setDots(initialDotsState);
  } else if (pinCodeInput.length === 4) {
    const compare = isEqual(pinCode, pinCodeInput);
    console.log('COMPARE', compare);
    if (compare) {
      AsyncStorage.setItem('PinCode', pinCode)
        .then(resp => console.log('SUC PIN SET', resp))
        .catch(err => console.log('ERR', err));
      navigation.navigate('BioAuthScreen');
    } else {
      Alert.alert('Ошибка', 'Введенные ПИН-Коды не совпадают');
      setPinCodeInput('');
      setDots(initialDotsState);
    }
  }

  const checkPinCode = () => {
    AsyncStorage.getItem('PinCode')
      .then(res => {
        console.log('SUC GET PIN', res);
        setStoredPin(res);
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  const checkBioAuth = () => {
    AsyncStorage.getItem('isBioAuthActive')
      .then(res => {
        console.log('SUC GET BIO', res);
        if (res) {
          setIsBioAuthActive(true);
        }
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  const enterWithBioAuth = async () => {
    await FingerprintScanner.authenticate({
      title: 'Войти в приложение с помощью отпечатка пальца?',
    })
      .then(() => {
        successLogin();
      })
      .catch(() => {
        FingerprintScanner.release();
      });
  };

  const onPadPress = element => {
    switch (pinStatus) {
      case 'choose':
        if (element === 'Удалить') {
          setPinCodeInput(pinCodeInput.slice(0, -1));
          let lens = dots;
          let index = pinCodeInput.length - 1;

          let len = lens[index];
          len.colored = false;
          console.log('DELETE', len);
        } else if (element === 'Палец') {
          enterWithBioAuth();
        } else if (element === 'Выход') {
          AsyncStorage.removeItem('KeyChainActive');
          AsyncStorage.removeItem('isBioAuthActive');
          AsyncStorage.removeItem('PinCode');
          Keychain.resetGenericPassword();
          setStoredPin(null);
          navigation.navigate('LoginScreen');
        } else {
          setPinCodeInput(prevState => prevState + element);
          let lens = dots;
          let index = pinCodeInput.length;
          let len = lens[index];
          len.colored = true;
        }
        break;
      case 'confirm':
        console.log('CONFIRM');
        if (element === 'Удалить') {
          setPinCodeInput(pinCodeInput.slice(0, -1));
          let lens = dots;
          let index = pinCodeInput.length - 1;

          let len = lens[index];
          len.colored = false;
          console.log('DELETE', len);
        } else if (element === 'Отмена') {
          setPinstatus('choose');
          setPinCode(null);
          setPinCodeInput('');
          setDots(initialDotsState);
        } else {
          setPinCodeInput(prevState => prevState + element);
          let lens = dots;
          let index = pinCodeInput.length;
          let len = lens[index];
          len.colored = true;
        }
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>
          {pinStatus === 'choose' ? 'Введите ПИН-Код' : 'Повторите ПИН-Код'}
        </Text>
        <FlatList
          contentContainerStyle={{
            flexDirection: 'row',
            alignSelf: 'center',
            margin: 10,
          }}
          data={dots}
          renderItem={item => {
            return (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 20,
                  marginHorizontal: 10,
                  backgroundColor: item.item.colored ? 'blue' : 'white',
                }}
              />
            );
          }}
        />
        <FlatList
          data={lines}
          renderItem={item => {
            const arr = item.item;
            return (
              <View
                style={{flexDirection: 'row', alignSelf: 'center'}}
                key={item.index}>
                {arr.map((element, key) => {
                  if (element !== '') {
                    return (
                      <TouchableOpacity
                        key={key.toString()}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: 'blue',
                          borderWidth: 2,
                          width: 75,
                          height: 75,
                          borderRadius: 50,
                          margin: 10,
                        }}
                        onPress={() => {
                          onPadPress(element);
                        }}>
                        <Text>{element}</Text>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <View
                        key={key.toString()}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 75,
                          height: 75,
                          margin: 10,
                        }}
                      />
                    );
                  }
                })}
              </View>
            );
          }}
          keyExtractor={item => item.toString()}
        />
      </View>
    </View>
  );
};

export default PinCodeScreen;
