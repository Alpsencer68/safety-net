import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Button
} from 'react-native-paper';


import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EmergencyNavigation from '../EmergencyNavigation';



export default function Home(props) {

    const { text, navigation } = props;
    // const [location, setLocation] = useState(null)    

    // useEffect(() => {
    //     Geolocation.getCurrentPosition(info => {
    //         console.log(info.coords)
    //         setLocation(info.coords)
    //       },
    //       error => {
    //         console.log(error.code, error.message);},
    //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    //       )
    // }, [])


    async function handleLogOut() {
        await auth().signOut();
        navigation.replace('Authentication', {screen: "Login"});
    }

    return (

        <View>
            <Button onPress={handleLogOut}>Log out</Button>
            <Button onPress={ () => navigation.navigate('Emergency', {screen: "ChooseLocation"})} >Help</Button>

        </View>
    );

}