import {
    CHECK_KEYCHAIN,
    SIGNIN,
    CHECK_PINCODE_AUTH,
    CHECK_BIO_AUTH_ACTIVE,
    HAS_BIO_AUTH,
    LOADING,
    TO_MAIN_SCREEN,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEqual} from 'lodash';
import * as Keychain from 'react-native-keychain';
import {Alert} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export const checkKeychain = () => dispatch => {
    console.log('ACTION');
    AsyncStorage.getItem('KeyChainActive')
        .then(res => {
            console.log('RES', res);
            if (res) {
                dispatch({
                    type: CHECK_KEYCHAIN,
                    hasKeyChain: true,
                    appLoading: false,
                });
            } else {
                console.log('HERE');
                dispatch({
                    type: CHECK_KEYCHAIN,
                    hasKeyChain: false,
                    appLoading: false,
                });
            }
        })
        .catch(err => {
            console.log('CRED ERR', err);
            dispatch({
                type: CHECK_KEYCHAIN,
                hasKeyChain: false,
                appLoading: false,
            });
        });
};

export const signIn = (data, rightCombination) => dispatch => {
    console.log('SIGNIN', data, rightCombination);
    dispatch({type: SIGNIN, hasKeyChain: false, signInLoading: true});
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
        setTimeout(
            () =>
                dispatch({
                    type: SIGNIN,
                    hasKeyChain: true,
                    signInLoading: false,
                }),
            3000,
        );
    } else {
        Alert.alert('Не правильно введен логин или пароль');
        dispatch({type: SIGNIN, hasKeyChain: false, signInLoading: false});
    }
};

export const checkPinBio = () => dispatch => {
    AsyncStorage.getItem('PinCode')
        .then(res => {
            console.log('SUC GET PIN', res);
            dispatch({type: CHECK_PINCODE_AUTH, pinCodeRedux: res});
        })
        .catch(err => {
            console.log('ERR', err);
        });
    FingerprintScanner.isSensorAvailable()
        .then(resp => {
            console.log('FINGER', resp);
            dispatch({type: HAS_BIO_AUTH, hasBioAuth: true});
        })

        .catch(err => {
            console.log('ERROR', err);
            dispatch({type: HAS_BIO_AUTH, hasBioAuth: false});
        });
    AsyncStorage.getItem('isBioAuthActive')
        .then(res => {
            console.log('SUC GET BIO', res);
            if (res) {
                dispatch({type: CHECK_BIO_AUTH_ACTIVE, isBioAuthActive: true});
            } else {
                dispatch({type: CHECK_BIO_AUTH_ACTIVE, isBioAuthActive: false});
                dispatch({type: LOADING});
            }
        })
        .catch(err => {
            console.log('ERR', err);
            dispatch({type: CHECK_BIO_AUTH_ACTIVE, isBioAuthActive: false});
            dispatch({type: LOADING});
        });
};

export const activateBioAuth = () => dispatch => {
    FingerprintScanner.authenticate({
        title: 'Активировать биометрическую аутентификацию?',
        cancelButton: 'Отмена',
    })
        .then(res => {
            console.log('BIO ACTIVE', res);
            AsyncStorage.setItem('isBioAuthActive', 'active')
                .then(resp => console.log('SUC', resp))
                .catch(err => console.log('ERR', err));
            dispatch({type: TO_MAIN_SCREEN, toMainScreen: true});
            FingerprintScanner.release();
        })
        .catch(err => {
            console.log('ACTIVATE FAIL', err);
            FingerprintScanner.release();
        });
};

export const toMainScreen = () => dispatch => {
    dispatch({type: TO_MAIN_SCREEN, toMainScreen: true});
};

export const stopLoading = () => dispatch => {
    dispatch({type: LOADING});
};

export const exitApp = () => dispatch => {
    AsyncStorage.removeItem('KeyChainActive');
    AsyncStorage.removeItem('isBioAuthActive');
    AsyncStorage.removeItem('PinCode');
    Keychain.resetGenericPassword();
    dispatch({
        type: CHECK_KEYCHAIN,
        hasKeyChain: false,
        appLoading: false,
    });
};
