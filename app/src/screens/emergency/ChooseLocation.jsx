import React, {useState, useEffect, useRef} from 'react';
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
import auth from '@react-native-firebase/auth';
import MapView, { Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import globalStyles from '../../utils/Styles';





const ChooseLocation = ({navigation, route}) => {
    useEffect(() => {
      navigation.setOptions({ title: 'Choose Location' });
    }, []);
    const mapRef = useRef(null)
    const [location, setLocation] = useState({latitude: 40, longitude: 40})  
    const [myLocation, setMyLocation] = useState({latitude: 40, longitude: 40})  

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            console.log(info.coords)
            setLocation(info.coords)
            setMyLocation(info.coords)

          },
          error => {
            console.log(error.code, error.message);},
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
          )
    }, [])
    useEffect(() => {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        longitudeDelta: 0.004,
        latitudeDelta: 0,
        })
    }, [myLocation])

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
      <MapView
      ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{
            flex: 1
          }}
        customMapStyle={globalStyles.map}
          initialRegion={{
             latitude: (location ? location.latitude : 40),
             longitude: (location ? location.longitude : 40),
             latitudeDelta: 0.1,
             longitudeDelta: 0.1,
           }}
        showsUserLocation={true}
        onLongPress={(e) => setLocation(
            {latitude: e.nativeEvent.coordinate.latitude, 
            longitude: e.nativeEvent.coordinate.longitude}
            )}
      >
        { location && <Marker coordinate={location}/>}
      </MapView>
      <View>
      <Button 
        buttonColor= {globalStyles.button1.buttonColor} textColor={globalStyles.button1.textColor} style={ {...globalStyles.smallAddButtonBlack, marginTop: 10, marginBottom: 0, backgroundColor: "#EA5753"}}
        onPress={()=>navigation.replace('ChooseVictim', {location: location})}>Use My Current Location</Button>
        <Button 
        textColor={globalStyles.button1.textColor} style={ {...globalStyles.smallAddButtonBlack, marginBottom: 0}}
        onPress={()=>navigation.replace('ChooseVictim', {location: location})}>Continue</Button>
        
      </View>
        </View>
    )
            }

export default ChooseLocation