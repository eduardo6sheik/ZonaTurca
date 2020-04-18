import 'react-native-get-random-values';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default class MyWeb extends Component {
  componentDidMount(){
    this.activivarNotificaciones();
    this.permisoParaResivirNotificaiones();
  }

  activivarNotificaciones = async () =>{
    const activar = await messaging().registerDeviceForRemoteMessages();
    console.log(activar);
  }

  permisoParaResivirNotificaiones = async () =>{

    const permiso = await messaging().requestPermission();

    if (permiso) {
      console.log('Permission settings:', permiso);
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: 'blue',flex: 1 }}>
        <WebView
          source={{ uri: 'https://zonaturca.com/' }}
        />
      </View>
    );
  }
}
