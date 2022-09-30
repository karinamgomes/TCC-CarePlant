import React, { useEffect } from 'react';
import { View } from 'react-native';
import WebSocketSignalR from '../signalR/WebSocketSignalR'

export const Teste = () => {

 useEffect(() => {
    WebSocketSignalR.onReceiveMessage('ReceiveMessage', async function (user:any, message:any) {
       console.log(user, message)
    });
  }, [])
  
  return (
    <View>
      
    </View>
  )
}
