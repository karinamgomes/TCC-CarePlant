import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import confirmationImg from '../assets/confirmation.png';
import { Header } from '../components/Header';

interface Params {
    title: string;
    subtitle: string;
    buttonTitle: string;
    nextScreen: string;
}

export function Confirmation(){
    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        buttonTitle,
        subtitle,
        nextScreen
    } = routes.params as Params;
    
    function handleMoveOn(){
        navigation.navigate(nextScreen as never);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
                <Header />
            </View> */}
            <View style={styles.content}>
                <Image
                    source={confirmationImg}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.subtitle}>
                    {subtitle}
                    
                </Text>                

                <View style={styles.footer}>
                   
                    <TouchableOpacity
                        style={styles.confirmButton}
                        activeOpacity={0.7}
                        onPress={handleMoveOn}
                    >
                        <Text style={styles.text}>
                            {buttonTitle}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor:colors.baseGreen,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.heading,
        textAlign: 'center',
        color: colors.white,
        lineHeight: 38,
        marginTop: 15,
    },
    subtitle: {
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize: 17,
        paddingVertical: 15,
        color: colors.white,
    },
    footer: {
        width: '100%',        
        paddingHorizontal: 50,
        marginTop: 20
    },

    confirmButton: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
    },
    text:{
        color: colors.green,

    },
    image: {
        height: Dimensions.get('window').width * 0.3
    },
    // header: {
    //     paddingHorizontal: 10
    // },
})