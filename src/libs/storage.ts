import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';
import axios from 'axios';

export interface PlantProps {
    nome: string;
    nivelDeUmidade: number
    codigoSensor: string;
    partitionKey: string;
    rowKey: string;
    dataAlarme?: string,
    sensor: boolean,
    urlFotoPlanta?: string,
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
        notificationId: string;
    }
}


export async function removePlant(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);
    delete plants[id];

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}