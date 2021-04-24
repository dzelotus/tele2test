/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {isEqual} from 'lodash';
import {useForm, Controller} from 'react-hook-form';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

//комбинация для входа в приложение
const rightCombination = {
  login: 'test',
  password: 'test',
};

const LoginScreen = props => {
  console.log('LOGIN PROPS', props);
  const [loading, setLoading] = useState(false);
  const {navigation} = props;

  const navigateToPin = () => {
    navigation.navigate('PincodeScreen');
  };

  //Подтверждаем введенные данные
  const onSubmit = data => {
    //Проверка совпадения комбинаций логина и пароля
    setLoading(true);
    if (isEqual(data, rightCombination)) {
      //Как будто сервер вернул положительный ответ
      const username = data.login;
      const password = data.password;

      //Записываем логин пароль в Keychain store
      Keychain.setGenericPassword(username, password).then(() =>
        //Дополнительно создаем токен активации Keychain store
        AsyncStorage.setItem('KeyChainActive', 'true'),
      );

      //Имитирую загрузку для перехода к вводу пин-кода
      setTimeout(navigateToPin, 3000);
    } else {
      Alert.alert('Не правильно введен логин или пароль');
      setLoading(false);
    }
  };

  //Для react-hook-form
  const {control, handleSubmit, errors} = useForm();

  return (
    <View style={{flex: 1}}>
      <View
        style={{backgroundColor: 'white', flex: 1, justifyContent: 'center'}}>
        <Text
          style={{
            position: 'absolute',
            top: 50,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 25,
          }}>
          АВТОРИЗАЦИЯ
        </Text>
        <View style={styles.inputsContainer}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={{borderBottomWidth: 1, borderBottomColor: 'blue'}}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    textValue={value}
                    style={{flex: 1}}
                    placeholder="Введите вашу рабочую почту"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}
            name="login"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <View
                style={{
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TextInput
                  onChangeText={onChange}
                  onBlur={onBlur}
                  textValue={value}
                  style={{flex: 1}}
                  placeholder="Введите пароль"
                  defaultValue=""
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}
            name="password"
            defaultValue=""
          />
        </View>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleSubmit(onSubmit)}>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Text>Войти</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 50,
  },
  inputsContainer: {
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    backgroundColor: '#fff',
  },

  enterButton: {
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
  rowDirection: {
    flexDirection: 'row',
  },
});

export default LoginScreen;
