import { StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Checkbox, Chip, Modal, Portal, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import helpCenterNeeds from '../../utils/helpCenterNeeds.json'
import { useState } from "react";
import DropDown from "react-native-paper-dropdown";
import getCities from "../../utils/getCities";
import SelectLocationModal from "../../components/SelectLocationModal";
import globalStyles from "../../utils/Styles";

import auth from '@react-native-firebase/auth';

export default function AddHelpCenter({ navigation, route }) {

    const [chipsData, setChipsData] = useState(helpCenterNeeds.data);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);

    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [citySelection, setCitySelection] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalSelection, setModalSelection] = useState((route.params ? route.params.location : false));

    const [address, setAddress] = useState();

    function setSelectionData(index) {
        const newChipsData = chipsData.map((value) => {return {...value}});
        const newValue = newChipsData[index].selected ? !newChipsData[index].selected : true;
        newChipsData[index].selected = newValue;
        setChipsData(newChipsData);
    }

    const chips = chipsData.map((data, index) => {
        return (

            <Checkbox.Item
                key={index}
                label={data.name}
                status={data.selected ? 'checked' : 'unchecked'}
                onPress={() => setSelectionData(index)}
            />)
    });



    async function addHelpCenter() {



        filteredNeeds = chipsData.filter((value) => {
            return value.selected ? value.selected : false;
        });

        const userId = auth().currentUser.uid;

        if( !(name && citySelection && address && modalSelection && userId) ) {
            ToastAndroid.show('Missing information!', ToastAndroid.LONG);
            return;
        }

        const newHelpCenter = {
            name: name,
            city: citySelection,
            address: address,
            location: modalSelection,
            needs: filteredNeeds.map((value) => value.name),
            user: userId,
            timestamp: (new Date()),
        }

        await firestore().collection('helpCenters').add(newHelpCenter);

        navigation.pop();
    }

    function handleNameChange(text) {
        setName(text);
    }

    function handleAddressChange(text) {
        setAddress(text);
    }

    function handleSelectLocation() {
        setModalVisible(true);
    }

    function hideModal() {
        setModalVisible(false);
    }


    function handleModalConfirm(coordinates) {
        setModalSelection(coordinates);
        setModalVisible(false);
    }

    return (

        <View style={{flex: 1, backgroundColor:'#FFFFFF'}}>
            <View style={{flex: 1, backgroundColor:'#FFFFFF', marginHorizontal:20}}>
            <Portal>
                <SelectLocationModal
                    isModalVisible={isModalVisible}
                    hideModal={hideModal}
                    onConfirm={handleModalConfirm}
                    modalSelection={modalSelection}
                />
            </Portal>
            <TextInput
                mode="outlined"
                label="Name"
                //placeholder="E-mail"
                error={nameError}
                onChangeText={(text) =>
                    handleNameChange(text)} />
            <TextInput style={ {height: 80}} 
                mode="outlined"
                label="Address"
                //placeholder="E-mail"
                //error={addressError}
                onChangeText={(text) =>
                    handleAddressChange(text)} />
            <DropDown
                label="City"
                mode='outlined'
                visible={isShowDropdown}
                showDropDown={() => setIsShowDropdown(true)}
                onDismiss={() => setIsShowDropdown(false)}
                value={citySelection}
                setValue={setCitySelection}
                list={getCities()}
                dropDownItemStyle={{backgroundColor: "#FCEDEE",}}
                dropDownItemSelectedStyle={{backgroundColor: "#F8D1D2",}}
            ></DropDown>
            <Button style={ {...globalStyles.smallAddButtonBlack.style}} textColor='white' onPress={handleSelectLocation}>Select Location</Button>
            {modalSelection ?
                <Text style={styles.locationText}>Location: {modalSelection.latitude.toFixed(3)}, {modalSelection.longitude.toFixed(3)}</Text>
                :
                <Text style={styles.locationText}>Location: Not Selected</Text>
            }
            <Text style={styles.providedText}>Provided</Text>
            {chips}
            <Button style={ {...globalStyles.smallAddButtonBlack.style}} textColor='white' onPress={addHelpCenter}>Add Help Center</Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {

    },
    locationText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        padding: 40,
        margin: 20,
        flex: 1,
    },
    providedText:{
        fontWeight: 'bold'
    },
})
