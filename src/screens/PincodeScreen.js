/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
'use-strict';
import {isEqual} from 'lodash';
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {connect} from 'react-redux';
import {
    checkPinBio,
    exitApp,
    toMainScreen,
    stopLoading,
} from '../actions/AuthActions';

const rightCombination = {
    login: 'test',
    password: 'test',
};

const PinCodeScreen = props => {
    console.log('PINCODE PROPS', props);

    const {
        navigation,
        checkPinBio,
        loading,
        hasBioAuth,
        isBioAuthActive,
        pinCodeRedux,
        toMainScreen,
        exitApp,
        stopLoading,
    } = props;

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
    const [dots, setDots] = useState(initialDotsState);
    const [cancelBioAuth, setCancelBioAuth] = useState();

    const cancel =
        pinStatus === 'confirm' ? 'Отмена' : pinCodeRedux ? 'Выход' : '';
    const deleteSymbol = pinCodeInput.length
        ? 'Удалить'
        : isBioAuthActive
        ? 'Палец'
        : '';

    //массив для рендера пин-пада
    const lines = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        [cancel, '0', deleteSymbol],
    ];

    console.log('CANCEL AUTH', cancelBioAuth);

    useEffect(() => {
        checkPinBio();

        if (isBioAuthActive && !cancelBioAuth) {
            console.log('ENTER');
            enterWithBioAuth();
        }

        if (pinCodeRedux) {
            validatePinCode();
        } else {
            validatePinCodeInput();
        }
    }, [pinCodeInput, isBioAuthActive]);

    const validatePinCode = () => {
        if (pinCodeInput === pinCodeRedux) {
            successLogin();
        } else if (pinCodeInput.length === 4) {
            Alert.alert('Ошибка', 'Неверный ПИН-Код');
            setPinCodeInput('');
            setDots(initialDotsState);
        }
    };

    const validatePinCodeInput = () => {
        if (pinCodeInput.length === 4 && !pinCode) {
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
                if (hasBioAuth) {
                    navigation.navigate('BioAuthScreen');
                } else {
                    toMainScreen();
                }
            } else {
                Alert.alert('Ошибка', 'Введенные ПИН-Коды не совпадают');
                setPinCodeInput('');
                setDots(initialDotsState);
            }
        }
    };

    const successLogin = () => {
        Keychain.getGenericPassword().then(response => {
            const keychainCombination = {
                login: response.username,
                password: response.password,
            };

            if (isEqual(keychainCombination, rightCombination)) {
                if (hasBioAuth && !isBioAuthActive) {
                    navigation.navigate('BioAuthScreen');
                } else {
                    toMainScreen();
                }
            } else {
                Alert.alert('Ошибка');
                exitApp();
            }
        });
    };

    const enterWithBioAuth = () => {
        FingerprintScanner.authenticate({
            title: 'Войти в приложение с помощью отпечатка пальца?',
        })
            .then(() => {
                successLogin();
            })
            .catch(() => {
                stopLoading();
                setCancelBioAuth(true);
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
                    exitApp();
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

    if (loading) {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }
    return (
        <View style={styles.screenContainer}>
            <View>
                <Text style={styles.title}>
                    {pinStatus === 'choose'
                        ? 'Введите ПИН-Код'
                        : 'Повторите ПИН-Код'}
                </Text>
                <FlatList
                    contentContainerStyle={styles.dotsContainer}
                    data={dots}
                    renderItem={item => {
                        return <View style={dotStyle(item)} />;
                    }}
                />
                <FlatList
                    data={lines}
                    renderItem={item => {
                        const arr = item.item;
                        return (
                            <View
                                style={styles.numPadContainer}
                                key={item.index}>
                                {arr.map((element, key) => {
                                    if (element !== '') {
                                        return (
                                            <TouchableOpacity
                                                key={key.toString()}
                                                style={styles.buttonWithCircle}
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
                                                style={styles.emptyButton}
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

const dotStyle = item => {
    return {
        width: 20,
        height: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 10,
        backgroundColor: item.item.colored ? 'blue' : 'white',
    };
};

const styles = StyleSheet.create({
    activityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        margin: 10,
    },
    numPadContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    buttonWithCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'blue',
        borderWidth: 2,
        width: 75,
        height: 75,
        borderRadius: 50,
        margin: 10,
    },
    emptyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: 75,
        margin: 10,
    },
});

const mapStateToProps = ({auth}) => {
    const {pinCodeRedux, hasBioAuth, isBioAuthActive, loading} = auth;

    return {pinCodeRedux, hasBioAuth, isBioAuthActive, loading};
};

export default connect(mapStateToProps, {
    checkPinBio,
    toMainScreen,
    exitApp,
    stopLoading,
})(PinCodeScreen);
