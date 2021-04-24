/* eslint-disable no-shadow */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {connect} from 'react-redux';
import {signIn} from '../actions/AuthActions';

//комбинация для входа в приложение
const rightCombination = {
    login: 'test',
    password: 'test',
};

const LoginScreen = props => {
    console.log('LOGIN PROPS', props);

    const {signIn, signInLoading} = props;

    //Подтверждаем введенные данные
    const onSubmit = data => {
        //Проверка совпадения комбинаций логина и пароля
        signIn(data, rightCombination);
    };

    //Для react-hook-form
    const {control, handleSubmit} = useForm();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>АВТОРИЗАЦИЯ</Text>
            <View style={styles.inputsContainer}>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <View style={styles.bottomBorder}>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    textValue={value}
                                    style={styles.textInputStyle}
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
                        <View style={styles.textInputContainer}>
                            <TextInput
                                onChangeText={onChange}
                                onBlur={onBlur}
                                textValue={value}
                                style={styles.textInputStyle}
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
                {signInLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <Text>Войти</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 25,
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
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
    textInputContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textInputStyle: {
        flex: 1,
    },
});

const mapStateToProps = ({auth}) => {
    const {hasKeyChain, signInLoading} = auth;

    return {
        hasKeyChain,
        signInLoading,
    };
};

export default connect(mapStateToProps, {signIn})(LoginScreen);
