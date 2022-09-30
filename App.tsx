import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import WebSocketSignalR from './src/signalR/WebSocketSignalR';

import Routes  from './src/routes';
import { PlantProps } from './src/libs/storage';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';

export default function App(){
  const [socketConnectionReady, setSocketConnectionReady] = useState(false)
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    if(!socketConnectionReady) {
      WebSocketSignalR.initSocketConnection(() => {
        setSocketConnectionReady(true)
      })
    }
  }, [])

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
        console.log(data);
      }
    )

    return () => subscription.remove();

    // async function notifications() {    
    //   await Notifications.cancelAllScheduledNotificationsAsync();      

    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log("######## NOTIFICAÇÕES AGENDAS ########")
    //   console.log(data);
    // }

    // notifications();
  },[])

  if(!fontsLoaded)
    return <AppLoading />
    
  return ( socketConnectionReady &&
    <Routes />
    
  )
}
