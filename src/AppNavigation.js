/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {checkKeychain} from './actions/AuthActions';

import LoginScreen from './screens/LoginScreen';
import PinCodeScreen from './screens/PincodeScreen';
import BioAuthScreen from './screens/BioAuthScreen';
import MainScreen from './screens/MainScreen';
import WhiteScreen from './screens/WhiteScreen';

const Stack = createStackNavigator();

const AppNavigation = props => {
    console.log('NAVIGATOR PROPS', props);
    const {checkKeychain, hasKeyChain, appLoading, toMainScreen} = props;

    useEffect(() => {
        checkKeychain();
    }, []);

    const SetPinCodeFlow = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="PincodeScreen"
                    component={PinCodeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="BioAuthScreen"
                    component={BioAuthScreen}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        );
    };

    return (
        <Stack.Navigator>
            {appLoading ? (
                <Stack.Screen
                    name="WhiteScreen"
                    component={WhiteScreen}
                    options={{headerShown: false}}
                />
            ) : !hasKeyChain ? (
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{headerShown: false}}
                />
            ) : !toMainScreen ? (
                <Stack.Screen
                    name="PinCodeFlow"
                    component={SetPinCodeFlow}
                    options={{headerShown: false}}
                />
            ) : (
                <Stack.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{headerShown: false}}
                />
            )}
        </Stack.Navigator>
    );
};

const mapStateToProps = ({auth}) => {
    const {hasKeyChain, appLoading, toMainScreen} = auth;

    return {
        hasKeyChain,
        appLoading,
        toMainScreen,
    };
};

export default connect(mapStateToProps, {checkKeychain})(AppNavigation);
