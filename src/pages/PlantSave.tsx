import React, { useEffect, useState } from 'react';
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

interface Params {
    plant: PlantProps
}

export function PlantSave() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');
    const [hasHumiditySensor, setHasHumiditySensor] = useState(false);
    const [inputNumber, setInputNumber] = useState<any>(0);
    const route = useRoute();

    const navigation = useNavigation();

    function handleChangeTime(dateTime: Date) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro! ⏰');
        }

        if (dateTime)
            setSelectedDateTime(dateTime!);
    }

    function handleOpenDatetimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {
        // try {
        //     console.log("plant:")
        //     console.log(plant)
        //     await savePlant({
        //         ...plant,
        //         dateTimeNotification: selectedDateTime
        //     });

        //     navigation.navigate('Confirmation' as never, {
        //         title: 'Tudo certo',
        //         subtitle: `Cadastro de ${plant.name} realizado com sucesso.`,
        //         buttonTitle: 'Minhas plantas',
        //         nextScreen: 'MyPlants',
        //     } as never);

        // } catch(err) {
        //     Alert.alert('Não foi possível salvar.');
        //     console.log(err)
        // }
    }

    function onChanged (text:any) {
        let onlyNumbers = text.replace(/[\D]/g, '')
        if(onlyNumbers?.length > 3){
            onlyNumbers = onlyNumbers.substr(0,3)
       }
        setInputNumber(onlyNumbers)
    }
    const [image, setImage] = useState<any>();
    
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
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("result")
      //@ts-ignore
      console.log(result.uri)
      let uri = ""
      if (!result.cancelled) {
        setImage(result.uri);
        uri=result.uri
      }
      return uri
    };

    // const { handleChange, handleSubmit, values } = useFormik({
    //     initialValues: {urlImage:'', name: '', hasHumiditySensor: '',  dateNotification: new Date(), level:"" },
    //     onSubmit: values =>
    //         {console.log(values)
    //       alert(`nome: ${values.name}, hasHumiditySensor: ${values.hasHumiditySensor}`)}
    //   });
    
    const getNameUser = async()=>{
        const name = await AsyncStorage.getItem('@plantmanager:user')
        return name
    }

   return (
    <Formik initialValues={{urlImage:'', name: '', hasHumiditySensor: false,  dateNotification: new Date(), level:"" }} 
    onSubmit={async (values)=>{
        try{
            //TODO: ver se vai colocar campo IDSensor
            var dataGravarPlantas = {
                partitionKey: await getNameUser(),
                rowKey: values.name,
                nome: values.name,
                nivelDeUmidade: values.hasHumiditySensor ? parseInt(values.level) : 0,
                nomeTableStorage: "Planta",
                sensor:values.hasHumiditySensor?true:false,
                codigoSensor: "94:B5:55:2B:67:90",
                urlFotoPlanta: image,
            }

            console.log("dataGravarPlantas")
            console.log(dataGravarPlantas)

            axios({
                method: 'put',
                url: 'https://middleware-arduino.azurewebsites.net/GravarPlantas',
                data: dataGravarPlantas
              }).then((response) => {
                console.log(response.data);
                navigation.navigate('Confirmation' as never, {
                    title: 'Tudo certo',
                    subtitle: `Cadastro de ${values.name} realizado com sucesso.`,
                    buttonTitle: 'Minhas plantas',
                    nextScreen: 'MyPlants',
                } as never);
            
            });
    
              

        }catch(err){ alert(err)}
        

        }}>
        {({ handleChange, handleBlur, handleSubmit,setFieldValue, values }) => (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollListContainer}
        >
            
            <View style={styles.container}>
                <View style={styles.plantInfo}>

                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

                    {!image &&<TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        // onPress={()=>{pickImage(); handleChange('urlImage')}}>
                        onPress={() =>{ setFieldValue('urlImage', pickImage())}}>
                        <Image
                        source={teste}
                        style={styles.plusCicle}  
                        />
                        <Text style={styles.buttonTextStyle}>Adicione uma imagem </Text>
                    </TouchableOpacity>}
                    
                    <TextInput 
                        style={styles.inputPlantName}
                        placeholder='Nome da Planta'
                        placeholderTextColor={colors.white}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                    />
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <CheckBox
                            // disabled={false}
                            // checked={hasHumiditySensor}
                            checked={values?.hasHumiditySensor}
                            onPress={() => {setHasHumiditySensor(!values?.hasHumiditySensor);setFieldValue('hasHumiditySensor', !values?.hasHumiditySensor)}}


                            // onBlur={handleBlur('hasHumiditySensor')}
                            // ={values.hasHumiditySensor}
                        />
                        <Text style={styles.tipText}>
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
                            is24Hour={true}
                            display="default"
                            onChange={(event,date)=>{
                                handleChangeTime(date!)
                                setFieldValue('dateNotification', new Date(date!))
                            }}
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
                                style={[ styles.inputNumber]}                                
                                value={inputNumber+'%'}
                                onChangeText={texte => {onChanged(texte); setFieldValue('level', texte)}}
                                onBlur={handleBlur('level')}
                                // value={values.level}
                            />

                    </View>
                    }

                    <Button
                        title="Cadastrar nova planta"
                        onPress={()=>handleSubmit()}
                    />
                </View>
            </View>
        </ScrollView>
            )}
        </Formik>
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
    },
    inputPlantName:{
        borderBottomColor:colors.white,
        borderBottomWidth:1,
        color:colors.white,
         width:'70%',
        padding:4,
        textAlign:"center",
        fontSize:17,
        marginTop:'15%'
        
    },
    buttonStyle: {
        borderWidth: 0,
        height: 40,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
        alignItems:'center',    
        marginBottom:25  ,
        padding:2 ,
        marginVertical:100
      },

      buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 20,
      },
      plusCicle:{
        height:50,
        width:50
      },
    
});