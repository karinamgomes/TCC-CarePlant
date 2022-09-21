import React, { useEffect, useState } from 'react';
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    Animated,
    ImageBackground
} from 'react-native';
import { PlantProps } from "../libs/storage";
import { useNavigation } from "@react-navigation/native";
import { Button } from '../components/Button';
import waterdrop from '../assets/waterdrop.png';
import PlantaFake from '../assets/PlantaFake.png';
import water from '../assets/water.png';

interface Params {
    plant: PlantProps
}
export function PlantStatus() {

    return (
        // <Animated.View style={styles.container}>
            <ImageBackground source={water} style={styles.container} imageStyle= 
            {{opacity:0.5}}>
                <View style={styles.item}>
                    <Image
                        source={PlantaFake}
                        style={styles.imagePhoto}  
                    />
                    <Text style={styles.title}>nome da planta</Text>
                </View>
                <View style={styles.waterLeve}>
                    <Image
                        source={waterdrop}
                        style={styles.spotlightImage}    
                    />
                    <Text style={styles.waterLeveText} >  85%</Text>
                </View>
                <View>
                    <Text>Horário da regagem</Text>
                </View>

                <Button style={styles.button} title='Alterar horário' />
            </ImageBackground>
        // </Animated.View>
    )
}
const styles = StyleSheet.create({
    item:{
        marginTop:20,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    image: {
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center"
    },
    imagePhoto: {
        width:160,
        height:160,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.baseGreen,
        borderRadius: 16,
        height: 60,
        minWidth: '70%',
        marginBottom: 30,

    },
    container: {
        flex: 1,
        alignItems: 'center',
        width:'100%',
        justifyContent: 'space-between',
        paddingHorizontal:0,
        paddingTop: 0,
        backgroundColor: colors.background,
        minHeight: 80,
        
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 24,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
        paddingRight: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    spotlightImage: {
        width: 48,
        height: 48
    },
    waterLeve: {
        width: 164,
        height:72,
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    waterLeveText: {
        fontSize: 24,
        color: colors.text
    }
});