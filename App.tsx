import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import { PlantProps } from './src/libs/storage';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import axios from 'axios';
import { sendNotification } from './src/utils/send-notification';

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  const getHasNotification = async () => {
    try {
      return await axios({
        method: 'get',
        url: 'https://middleware-arduino.azurewebsites.net/TableStorage/Notificacao?tableStorageName=HistoricoUmidade',
        headers: {
          accept: '/',
          partitionKey: "94:B5:55:2B:67:90"
        }
      }).then((response) => {

        return response.data
      });
    } catch (err) {
      console.log(err)
      return null
    }
  }
  useEffect(() => {
    const interval = setInterval(async() => {
      const result = await getHasNotification()
      if(result.conteudo.length >0) sendNotification(result.nome)
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });


    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
      }
    )

    return () => subscription.remove();

  }, [])
  if (!fontsLoaded)
    return <AppLoading />

  return (
    <Routes />
  )
}
