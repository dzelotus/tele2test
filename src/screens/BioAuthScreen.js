/* eslint-disable no-shadow */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {connect} from 'react-redux';
import {toMainScreen, activateBioAuth} from '../actions/AuthActions';

const BioAuthScreen = props => {
    const {activateBioAuth, toMainScreen} = props;

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>
                Подключите биометрическую авторизацию, чтобы не вводить код
                доступа
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => activateBioAuth()}>
                <Text>Подключить</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => toMainScreen()}>
                <Text>Не подключать</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
    },

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

const mapStateToProps = ({auth}) => {
    const {pinCodeRedux, hasBioAuth, isBioAuthActive, loading} = auth;

    return {pinCodeRedux, hasBioAuth, isBioAuthActive, loading};
};

export default connect(mapStateToProps, {toMainScreen, activateBioAuth})(
    BioAuthScreen,
);
