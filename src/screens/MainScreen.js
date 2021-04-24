import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MainScreen = props => {
    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>Поздравляем вы зашли!</Text>
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
});

export default MainScreen;
