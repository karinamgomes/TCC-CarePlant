import React from 'react';
import {
    SafeAreaView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import welcomeImg from '../assets/welcome.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Welcome() {
    const navigation = useNavigation();

    // async function ValidaNome(){
    //     let UserName = await AsyncStorage.getItem('@plantmanager:user')
    //     if(!UserName){
    //         navigation.navigate('UserIdentification' as never);
    //     }else{
    //         navigation.navigate('MyPlants' as never)
    //     }
    // }
    

    async function handleStart(){
        console.log("await AsyncStorage.getItem('@plantmanager:user')")
        console.log(await AsyncStorage.getItem('@plantmanager:user'))
        let UserName = await AsyncStorage.getItem('@plantmanager:user')
        if(!UserName){
            navigation.navigate('UserIdentification' as never);
        }else{
            navigation.navigate('MyPlants' as never)
        }
    }

    const teste = AsyncStorage.getItem("@plantmanager:user");
    console.log("JSON.stringify(teste)")
    console.log(JSON.stringify(teste))

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    Gerencie {'\n'}
                    suas plantas de {'\n'}
                    forma fácil
                </Text>

                <Image
                    source={welcomeImg}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.subtitle}>
                    Vamos ajudar você a manter
                    suas plantas hidratadas.
                </Text>

                <Text style={styles.init}>
                   Iniciar
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={handleStart}
                >
                    <Feather
                        name="chevron-right"
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.baseGreen,
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        color: colors.white,
        marginTop: 38,
        fontFamily: fonts.heading,
        lineHeight: 34
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: colors.white,
        fontFamily: fonts.text
    },
    image: {
        height: Dimensions.get('window').width * 0.7
    },
    button: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 56,
    },
    buttonIcon: {
        fontSize: 30,
        color: colors.baseGreen
    },
    init:{
        textAlign: 'center',
        fontSize: 16,
        paddingBottom:0,
        marginBottom:-25,
        paddingHorizontal: 20,
        color: colors.white,
        fontFamily: fonts.text 

    }

});
