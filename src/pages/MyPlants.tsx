import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Alert,
    Dimensions,
    Image
} from 'react-native';

import SemPlantas from '../assets/SemPlantas.png';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    
    function handlePlantSelect(plant: PlantProps){
        navigation.navigate('PlantStatus' as never, { plant } as never);
    }
    async function handleNewPlant(){
        navigation.navigate('PlantSelect' as never);
        console.log(myPlants)
    }
    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'Sim, remover',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) =>
                            oldData.filter((item) => item.id !== plant.id)
                        );
                    } catch (error) {
                        Alert.alert('Não foi possível remover! ');
                    }
                }
            }
        ])

    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant();
            setMyPlants(plantsStoraged);
            setLoading(false);
        }
        loadStorageData();
    }, [myPlants])

    if (loading) return <Load />

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Minhas <Text style={styles.plantsTitleBold}>Plantas</Text>
                </Text>
                {myPlants.length <= 0 ?
                <View style={styles.semplanta}>
                    <Image
                        source={SemPlantas}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.noPlants}>
                        Não há plantas cadastradas!
                    </Text>
                    
                </View>
                :
                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            onPress={()=>handlePlantSelect(item)}
                            handleRemove={()=>handleRemove(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
                }
            </View>
            <View>
                <Button style={styles.button}
                    title="Nova Planta"
                    onPress={handleNewPlant}
                />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.baseGreen,
        borderRadius: 16,
        height: 60,
        minWidth: '70%',
        marginBottom: 20

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingTop: 0,
        backgroundColor: colors.background,
        minHeight: 80
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 32,
        fontFamily: fonts.text,
        color: colors.heading,
        marginVertical: 20
    },
    plantsTitleBold: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    },
    image:{
        height: Dimensions.get('window').width * 0.4,
        width: 200,
        paddingHorizontal: 170,
        marginBottom:25
    },
    noPlants:{
        fontSize: 22,
        fontFamily: fonts.heading,
        color: colors.heading,
    },
    semplanta:{
        alignItems: 'center',
        justifyContent:'center',
        height: Dimensions.get('window').width * 0.9
    }

});