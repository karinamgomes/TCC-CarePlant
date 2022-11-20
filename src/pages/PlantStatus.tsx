import React, { useEffect, useState } from 'react';
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground
} from 'react-native';
import { PlantProps } from "../libs/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from '../components/Button';
import waterdrop from '../assets/waterdrop.png';
import water from '../assets/water.png';
import axios from 'axios';
import { format } from 'date-fns';

interface Response {
    conteudo: {
        umidade: number,
        notificado: boolean,
    }
}
export function PlantStatus() {
    const [umidade, setUmidade] = useState<number>(0);
    const routes = useRoute();
    //@ts-ignore
    const [plant, setPlant] = useState<PlantProps>(routes.params.plant as PlantProps);
    const navigation = useNavigation();

    const getStatusPlant = async () => {
        try {
            axios({
                method: 'get',
                url: 'https://middleware-arduino.azurewebsites.net/TableStorage/NivelUmidade?tableStorageName=historicoumidade',
                headers: {
                    accept: '/',
                    partitionKey: plant?.partitionKey
                }
            }).then((response) => {
                const result: Response = response.data
                if (result?.conteudo.umidade)
                    setUmidade(result?.conteudo.umidade)
            });
        } catch (err) {
            setUmidade(0)
            return err
        }
    }

    useEffect(() => {

        if(plant?.sensor === true){
            getStatusPlant()
        }
    }, [plant])

    useEffect(() => {
    
        if(plant?.sensor === true){
            const interval = setInterval(() => {
                getStatusPlant()
            }, 5000);
            return () => clearInterval(interval);
        }
        
    }, [plant]);

    return (
        // <Animated.View style={styles.container}>
        <ImageBackground source={water} style={styles.container} imageStyle=
            {{ opacity: 0.5 }}>
            <View style={styles.item}>
                <Image
                source={{uri:plant? plant.urlFotoPlanta:''}}
                    // source={plant? plant.urlFotoPlanta: ''}
                    style={styles.imagePhoto}
                />
                <Text style={styles.title}>{plant? plant.nome:''}</Text>
            </View>
            {plant?.sensor ===true ?
            <View style={styles.waterLeve}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.waterLeveText} >  {umidade} %</Text>
            </View>
            :
            <View>
                <Text style={styles.horario}>Horário de regagem</Text>
                <Text style={styles.dataAlarme}>{plant?.dataAlarme ? format(new Date(plant!.dataAlarme),'HH:mm'):''}</Text>
            </View>
            }
            
            

            <Button style={styles.button} onPress={() => navigation.navigate('PlantEdit' as never, { plant } as never)} title='Alterar planta' />
        </ImageBackground>
        // </Animated.View>
    )
}
const styles = StyleSheet.create({
    item: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePhoto: {
        width: 260,
        height: 260,
        borderRadius:12
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
    dataAlarme:{
        display:"flex",
        alignItems:'center',
        justifyContent:'center',
        fontSize:24,
        color: colors.darkGreen,
        textAlign:'center',
        marginTop:10,
        
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        paddingTop: 120,
        backgroundColor: colors.background,
        minHeight: 80,

    },
    horario:{
        fontSize:16,
        color: colors.heading,
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 24,
        color: colors.heading,
        fontFamily: fonts.heading,
        // lineHeight: 20,
        marginTop: 22
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
        height: 72,
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