import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import * as Device from 'expo-device';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import { registerForPushNotificationsAsync } from './src/utils/send-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  const [expoPushToken, setExpoPushToken] = useState<any>('');
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification?true:false);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

useEffect(()=>{
   AsyncStorage.setItem('@plantmanager:expoPushToken',expoPushToken ? expoPushToken : "null");
},[expoPushToken])
  // const getHasNotification = async () => {
  //   try {
  //     return await axios({
  //       method: 'get',
  //       url: 'https://middleware-arduino.azurewebsites.net/TableStorage/Notificacao?tableStorageName=HistoricoUmidade',
  //       headers: {
  //         accept: '/',
  //         partitionKey: "94:B5:55:2B:67:90"
  //       }
  //     }).then((response) => {

  //       return response.data
  //     });
  //   } catch (err) {
  //     console.log(err)
  //     return null
  //   }
  // }
  // useEffect(() => {
  //   const interval = setInterval(async() => {
  //     const result = await getHasNotification()
  //     if(result.conteudo.length >0) sendNotification(result.nome)
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  

  // useEffect(() => {
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: false,
  //       shouldSetBadge: false,
  //     }),
  //   });


  //   const subscription = Notifications.addNotificationReceivedListener(
  //     async notification => {
  //       const data = notification.request.content.data.plant as PlantProps;
  //     }
  //   )

  //   return () => subscription.remove();

  // }, [])
  if (!fontsLoaded)
    return <AppLoading />

  return (
    <Routes />
  )
}
