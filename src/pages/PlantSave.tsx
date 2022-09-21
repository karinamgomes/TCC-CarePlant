import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity,
    TextInput,
    Dimensions
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';

import { Button } from '../components/Button';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
    plant: PlantProps
}

export function PlantSave() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');
    const [hasHumiditySensor, setHasHumiditySensor] = useState(false);
    const [inputNumber, setInputNumber] = useState<any>(0);

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro! ⏰');
        }

        if (dateTime)
            setSelectedDateTime(dateTime);
    }

    function handleOpenDatetimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });

            navigation.navigate('Confirmation' as never, {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Muito Obrigado :D',
                nextScreen: 'MyPlants',
            } as never);

        } catch {
            Alert.alert('Não foi possível salvar.');
        }
    }

    function onChanged (text:any) {
        let onlyNumbers = text.replace(/[\D]/g, '')
        if(onlyNumbers?.length > 3){
            onlyNumbers = onlyNumbers.substr(0,3)
       }
        setInputNumber(onlyNumbers)
    }
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollListContainer}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />
                    
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        {/* <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        /> */}
                        <CheckBox
                            disabled={false}
                            checked={hasHumiditySensor}
                            onPress={() => { setHasHumiditySensor(!hasHumiditySensor) }}

                        // style={styles.checkbox}
                        />
                        <Text style={styles.tipText}>
                            {/* {plant.water_tips} */}
                            Possui sensor de umidade instalado?
                        </Text>
                    </View>

                    {!hasHumiditySensor && <Text style={styles.alertLabel}>
                        Caso não possua sensor,{'\n'}
                        escolha o melhor horário para ser lembrado:
                    </Text>}

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDateTime}
                            mode="time"
                            display="spinner"
                            onChange={() => handleChangeTime}
                        />
                    )}

                    {
                        Platform.OS === 'android' && !hasHumiditySensor && (
                            <TouchableOpacity
                                style={styles.dateTimePickerButton}
                                onPress={handleOpenDatetimePickerForAndroid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {` ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                   {hasHumiditySensor && <View style={styles.tipContainerHasSensor}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                       
                        <Text style={styles.tipText}>
                        Em qual o nível de umidade 
                        você deseja ser notificado?
                        </Text>

                       
                        <TextInput 
                                keyboardType="numeric"
                                style={[
                                    styles.inputNumber
                                    // (isFocused ) &&
                                    // { borderColor: colors.white }
                                ]}                                // onBlur={handleInputBlur}
                                // onFocus={handleInputFocus}
                                value={inputNumber+'%'}
                                onChangeText={texte => onChanged(texte)}
                            />

                    </View>
}

                    <Button
                        title="Cadastrar nova planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },
    scrollListContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.baseGreen,
            height: Dimensions.get('window').height * 0.4
        

    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },

    tipContainerHasSensor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 14,
        marginBottom: 5
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    inputNumber:{
        width: 45,
        height:45,
        // backgroundColor:colors.red,
        borderRadius:10,
        borderColor:colors.gray,
        borderWidth:2,
        textAlign:'center',
        marginHorizontal:15
    }
    
});