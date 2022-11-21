import React, { useEffect, useState, useCallback } from 'react';
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
    Dimensions,
    Button as Cutton
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps } from '../libs/storage';

import { Button } from '../components/Button';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import * as ImagePicker from 'expo-image-picker';
import teste from '../assets/plus-circle.png';
import { Formik, useFormik, withFormik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { scheduleNotification } from '../utils/schedule/Notifications';

import * as yup from 'yup'

interface Params {
    plant: PlantProps
}

export function PlantEdit() {
    const route = useRoute();
    //@ts-ignore
    const plant:PlantProps = route.params.plant;
    const initialdateAlarmeValue = plant.dataAlarme ? new Date(plant.dataAlarme) : new Date()
    const initialNumberLevel = plant.nivelDeUmidade ? plant.nivelDeUmidade : 0
    const [selectedDateTime, setSelectedDateTime] = useState(initialdateAlarmeValue);
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');
    const [hasHumiditySensor, setHasHumiditySensor] = useState(false);
    const [inputNumber, setInputNumber] = useState<string>(initialNumberLevel.toString());
    const navigation = useNavigation();


    function handleChangeTime(dateTime: Date) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime)
            setSelectedDateTime(dateTime!);
    }

    

    function handleOpenDatetimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    function onChanged(text: any) {
        let onlyNumbers = text.replace(/[\D]/g, '')
        if (onlyNumbers?.length > 3) {
            onlyNumbers = onlyNumbers.substr(0, 3)
        }
        setInputNumber(onlyNumbers.toString())
    }
    const [image, setImage] = useState<string>(plant.urlFotoPlanta ?? '');

    const uploadImage = async () => {
        if (image != null) {
            const fileToUpload = image;
            const data = new FormData();
            data.append('name', 'Image Upload');
            data.append('file_attachment', fileToUpload);
            let res = await fetch(
                'http://localhost/upload.php',
                {
                    method: 'post',
                    body: data,
                    headers: {
                        'Content-Type': 'multipart/form-data; ',
                    },
                }
            );
            let responseJson = await res.json();
            if (responseJson.status == 1) {
                alert('Sucesso!');
            }
        } else {
            alert('Por favor, selecione uma imagem');
        }
    };

    const validationOnlyDigits = (value: any) => {
        if (value === undefined) return false
        const uri = value['_3']
        if (!uri) return false
        return true
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        //@ts-ignore
        let uri = ""
        if (!result.cancelled) {
            setImage(result.uri);
            uri = result.uri
        }
        return uri
    };

    const getNameUser = async () => {
        const name = await AsyncStorage.getItem('@plantmanager:user')
        return name
    }
    const platHashasHumiditySensorValidationSchema = yup.object().shape({
        name: yup.string().min(4, ({ min }) => `Minimo de ${min} letras`).required("Campo obrigatório"),
        // codeSensor: yup.string().required("Campo obrigatório"),
       
        level: yup.number().required("Campo obrigatório").min(0, ({ min }) => `O valor deve ser entre ${min} e 100`).max(100, ({ max }) => `O valor deve ser entre 0 e ${max}`)
    })

    const platNoHashasHumiditySensorValidationSchema = yup.object().shape({
        name: yup.string().min(4, ({ min }) => `Minimo de ${min} letras`).required("Campo obrigatório"),
        // urlImage: yup.object().test('uri', 'Campo obrigatório', (value) => {
        //     return validationOnlyDigits(value)
        // }),
        dateNotification: yup.date().required("Campo obrigatório"),
        // level: yup.number().min(0, ({ min }) => `O valor deve ser entre ${min} e 100`).max(100, ({ max }) => `O valor deve ser entre 0 e ${max}`)
    })

    const savePlant = useCallback(async (values: any) => {
        try {
            var dataGravarPlantas = {
                partitionKey: await getNameUser(),
                rowKey: plant.rowKey,
                nome: values.name,
                nivelDeUmidade: values.level? parseInt(values.level) : 0,
                nomeTableStorage: "Planta",
                sensor: plant.sensor,
                codigoSensor: plant.codigoSensor,
                urlFotoPlanta: plant.urlFotoPlanta,
                token: plant.token,
                dataAlarme: values.dateNotification,
            }

            axios({
                method: 'put',
                url: 'https://middleware-arduino.azurewebsites.net/GravarPlantas/Alterar',
                data: dataGravarPlantas
            }).then((response) => {

                if(!plant.sensor){
                    Notifications.cancelScheduledNotificationAsync(plant.nome)
                    scheduleNotification(dataGravarPlantas.nome,`${dataGravarPlantas.nome} precisa de cuidados, não esqueça de regá-la! 🌱`,dataGravarPlantas.dataAlarme)
                }

                navigation.navigate('Confirmation' as never, {
                    title: 'Tudo certo',
                    subtitle: `Atualização de ${values.name} realizado com sucesso.`,
                    buttonTitle: 'Minhas plantas',
                    nextScreen: 'MyPlants',
                } as never);

            }).catch(function (err) {
            Alert.alert('Erro', `Ocorreu um erro ao editar planta, por favor, tente novamente mais tarde!`)
               
            })
        } catch (err) {
            Alert.alert('Erro', `Ocorreu um erro ao editar planta, por favor, tente novamente mais tarde!`)
        }
    }, [image])

    return (
        <Formik initialValues={{ urlImage: plant.urlFotoPlanta ?? '', name: plant.nome , hasHumiditySensor: plant.sensor ?? false, dateNotification: selectedDateTime, level: plant.nivelDeUmidade ?? 0, codeSensor: plant.codigoSensor }}
            onSubmit={ (values) => {
                console.log(values)
                 savePlant(values)
            }
            }
            validationSchema={hasHumiditySensor ? platHashasHumiditySensorValidationSchema : platNoHashasHumiditySensorValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, touched, errors }) => (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollListContainer}
                >

                    <View style={styles.container}>
                        
                        <View style={styles.plantInfo}>
                        <Text style={styles.titlePage}>Editar</Text>
                            {image && <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />}

                            {!image && <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                // onPress={()=>{pickImage(); handleChange('urlImage')}}>
                                onPress={() => { setFieldValue('urlImage', pickImage()) }}>
                                <Image
                                    source={teste}
                                    style={styles.plusCicle}
                                />
                                <Text style={styles.buttonTextStyle}>Adicione uma imagem </Text>
                                
                                     <Text style={{ fontSize: 13, color: '#d11507' , paddingTop:8}}>{touched.urlImage && errors.urlImage ? errors.urlImage : ''}</Text>
                                
                            </TouchableOpacity>}

                            <TextInput
                                style={styles.inputPlantName}
                                placeholder='Nome da Planta'
                                placeholderTextColor={colors.white}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />
                            
                                <Text style={{ fontSize: 13, color: '#d11507' , paddingTop:8}}>{touched.name && errors.name ? errors.name: ''}</Text>
                            
                        </View>

                        <View style={styles.controller}>
                            {/* <View style={styles.tipContainer}>
                                <CheckBox
                                    // disabled={false}
                                    // checked={hasHumiditySensor}
                                    checked={values?.hasHumiditySensor}
                                    onPress={() => { setHasHumiditySensor(!values?.hasHumiditySensor); setFieldValue('hasHumiditySensor', !values?.hasHumiditySensor) }}


                                // onBlur={handleBlur('hasHumiditySensor')}
                                // ={values.hasHumiditySensor}
                                />
                                <Text style={styles.tipText}>
                                    Possui sensor de umidade instalado?
                                </Text>
                            
                               
                            </View> */}


                            {!plant.sensor && <Text style={styles.alertLabel}>
                                Horário de regagem:{'\n'}
                                
                            </Text>}

                            {showDatePicker && (
                                <>
                                    <DateTimePicker
                                        value={selectedDateTime}
                                        mode="time"
                                        is24Hour={true}
                                        display="default"
                                        onChange={(event, date) => {
                                            handleChangeTime(date!)
                                            setFieldValue('dateNotification', new Date(date!))
                                        }}
                                    />
                                    {
                                        touched.dateNotification && errors.dateNotification && <Text style={{ fontSize: 13, color: '#d11507' }}>teste</Text>
                                    }
                                </>
                            )}

                            {
                                Platform.OS === 'android' && !plant.sensor && (
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

                            {plant.sensor &&
                                <View style={styles.teste}>
                                    {plant.sensor && <View style={styles.boxCodeSensor}>

                                            <Text style={styles.inputCodeSensor}> Código do sensor: {plant.codigoSensor}</Text>
                                    </View>}
                                    
                                    <View style={styles.tipContainerHasSensor}>
                                        <Image
                                            source={waterdrop}
                                            style={styles.tipImage}
                                        />

                                        

                                        <Text style={styles.tipText}>
                                            Nível de umidade a ser notificado:
                                        </Text>

                                        <View style={styles.inputNumber}>
                                            <TextInput
                                                keyboardType="numeric"
                                                value={inputNumber.toString()}
                                                onChangeText={texte => { onChanged(texte); setFieldValue('level', texte) }}
                                                onBlur={handleBlur('level')}
                                            />
                                            <Text style={{ marginLeft: 2 }}>%</Text>
                                        </View>
                                    </View>
                                    
                                    <Text style={{ fontSize: 13, color: '#d11507', textAlign: 'center' }}>{touched.level && errors.level ? errors.level : ''}</Text>

                                </View>
                            }

                            <Button
                                // style={{paddingHorizontal:-1}}
                                title="Atualizar planta"
                                onPress={() => handleSubmit()}
                            />
                        </View>
                    </View>
                </ScrollView>
            )}
        </Formik>
    )



}

const styles = StyleSheet.create({
    titlePage:{
        fontSize:23,
        color:colors.white,
        // marginBottom:30,
        fontWeight:'600',
        width:"100%",
        textAlign:"center",
        paddingVertical:3,
        borderRadius:2,
        marginBottom:"12%"
        },
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.baseGreen,
        height: Dimensions.get('window').height * 0.1
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        alignContent: 'center',
        paddingTop: '25%',
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
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        borderRadius: 20,
        position: 'relative',

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
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    inputNumber: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 50,
        height: 45,
        borderRadius: 10,
        borderColor: colors.gray,
        borderWidth: 2,
        textAlign: 'center',
        marginHorizontal: 15,
        padding: 5,
    },
    inputPlantName: {
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
        color: colors.white,
        width: '70%',
        padding: 4,
        textAlign: "center",
        fontSize: 17,
        marginTop: '12%'

    },
    inputCodeSensor: {

        color: colors.heading,
        fontSize: 16,
        width: '65%',
        padding: 4,
        textAlign: "center",
        marginTop: '5%',
        marginBottom: '3%'

    },
    boxCodeSensor:{
        width:"100%",
        alignItems:'center',
        
    },
    buttonStyle: {
        borderWidth: 0,
        height: 40,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
        alignItems: 'center',
        marginBottom: 25,
        padding: 2,
        marginVertical: 100
    },

    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    plusCicle: {
        height: 50,
        width: 50
    },
    percentage: {

    },
    teste: {
        bottom: 60,
    }

});


