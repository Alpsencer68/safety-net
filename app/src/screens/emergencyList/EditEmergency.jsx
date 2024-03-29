


import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    FlatList,
    Image
} from 'react-native';

import {
    Button,
    List,
    TextInput,
    RadioButton,
    Checkbox,
    Portal
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import SelectLocationModal from "../../components/SelectLocationModal";
import MciIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../utils/Styles';



const EditEmergency = ({route, navigation}) => {

    const emergencyID = route.params.emergencyID;
    const [emergency, setEmergency] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalSelection, setModalSelection] = useState(false);
    const [user, setUser] = useState(false)
    const [conditions, setConditions] = useState(false)

    
    function handleSelectLocation() {
        setModalVisible(true);
    }

    function hideModal() {
        setModalVisible(false);
    }


    function handleModalConfirm(coordinates) {
        setModalSelection(coordinates);
        setEmergency((prevEmergency) => ({...prevEmergency, coordinates: coordinates}))
        setModalVisible(false);
    }

    useEffect(() => {
        const subscription = firestore().collection('emergencies').doc(emergencyID).onSnapshot(
            (snapshot) => {
                setEmergency(snapshot.data())
                console.log(snapshot.data())
                setModalSelection(snapshot.data().coordinates)
                setConditions(snapshot.data().conditions)
            })

        return ()=>{
            subscription()
            }
    }
,[])
useEffect(() => {
    const subscription2 = firestore().collection('users').doc(emergency.userID).onSnapshot(
        (snapshot) => {
            setUser(snapshot.data())
            console.log(snapshot.data())
        })
        return ()=>{
            subscription2()
            }
}, [emergency])

    return(
        <View style={globalStyles.mainView}>

            <View style={globalStyles.editView}>
            <Image
            style={{width: 400, height:300, alignSelf:'center'}}
            source={require('../../assets/victim.png')}
            />
            <Portal>
                <SelectLocationModal
                isModalVisible={isModalVisible}
                hideModal={hideModal}
                onConfirm={handleModalConfirm}
                modalSelection={modalSelection}
                />  
            </Portal>
            <Text>Name: {emergency?.otherName ? emergency.otherName : user?.name }</Text>
            <TextInput
            mode="outlined"
            label="Notes"
            value={emergency.notes}
            // error={nameError}
            onChangeText={(text) => setEmergency((prevEmergency) => ({...prevEmergency, notes: text}))} />
            <Checkbox.Item
            key={'Injured'}
            label={'Injured'}
            status={conditions?.injured ? 'checked' : 'unchecked'}
            onPress={ () => setConditions((prevConditions) => ({...prevConditions, injured: !conditions.injured }))}
            />
            <Checkbox.Item
            key={'Need Evacuation'}
            label={'Need Evacuation'}
            status={conditions?.evacuation ? 'checked' : 'unchecked'}
            onPress={ () => setConditions((prevConditions) => ({...prevConditions, evacuation: !conditions.evacuation }))}
            />
            <Checkbox.Item
            key={'Rescued'}
            label={'Rescued'}
            status={emergency?.rescued ? 'checked' : 'unchecked'}
            onPress={ () =>  setEmergency((prevEmergency) => ({...prevEmergency, rescued: !emergency.rescued}))}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button style={globalStyles.addButtonHorizontalQuarterScreen} buttonColor='#D0342C' textColor='white' onPress={ async()=> {
                await firestore().collection('emergencies').doc(emergencyID).delete()
                navigation.pop()

            }}>Delete</Button>
            <Button style={globalStyles.addButtonHorizontalQuarterScreen} buttonColor='#3A6351'  textColor='white' onPress={ async()=> {
                emergency.conditions = conditions
                await firestore().collection('emergencies').doc(emergencyID).set(emergency)
                navigation.pop()

            }}>Save</Button>
            
            {/* <Button onPress={ async () =>  {
                await firestore().collection('emergencies').doc(emergencyID).set({...emergency, rescued: true})
                navigation.pop()
                }}>Mark as rescued</Button> */}
            <Button style={globalStyles.addButtonHorizontalHalfScreen} buttonColor='black' icon={() => <MciIcon name="map-marker" size={24} color="white" />}   textColor='white' onPress={handleSelectLocation}>Edit Location</Button>

            </View>
            
            </View>
            
        </View>
    )
    
}



export default EditEmergency