import React, { useEffect, useState } from 'react';
import { 
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import userImg from '../assets/user.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header(){
    const [userName, setUserName] = useState<string>();
    let firstLetterNameUser:string|null;

    useEffect(() => {
        async function loadStorageUserName() {
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }
        
        loadStorageUserName();
    },[]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>
            {userName != null || userName != undefined ?
                <View style={styles.automaticImage}>
                    <Text style={styles.automaticTextImage}>{userName?.substr(0, 1)?.toLocaleUpperCase()}</Text>
                </View>
                :
                <Image source={userImg} style={styles.image} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,  
        marginTop: getStatusBarHeight(),
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    greeting: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    },
    automaticImage:{
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor:colors.baseGreen,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    },
    automaticTextImage:{
       
        textAlign:'center',
        textAlignVertical:'bottom',
        color:'white',
        fontSize:26,
        fontWeight:"600",

    }
});