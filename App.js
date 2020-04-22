import 'react-native-get-random-values';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyWeb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://zonaturca.com/',
    };
  }

  componentDidMount(){
    this.indentificarEntrada();
    this.activivarNotificaciones();
    this.permisoParaResivirNotificaiones();
    this.obtenerToken();
  }

  indentificarEntrada = async () =>{
    firestore().collection('notification').doc('datos').get()
    .then(snapshot => {
      if (snapshot.data().enviada == true) {
        this.setState({
          url: snapshot.data().url,
        });

        this.notificationVerificada();
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  }

  notificationVerificada = async () =>{
    firestore().collection('notification').doc('datos')
    .update({
      enviada: false,
    })
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

  obtenerToken = async () =>{
    let tokenUser = messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        this.getData(fcmToken);
        /*AsyncStorage.removeItem('token')*/
      } else {
        console.log('no ok');
      }
    });
  }

  getData = async (dataToken) =>{
    AsyncStorage.getItem('token').then(data => {
      console.log(data);
      if(data == null) {
        var characters = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
        var id = "";
        for (var i=0; i<20; i++) id +=characters.charAt(Math.floor(Math.random()*characters.length));

        const data = {
          id: id,
          token: dataToken,
        }

        AsyncStorage.setItem('token', JSON.stringify(data))

        console.log(dataToken);

        firestore().collection('tokens').doc(data.id).set({
          token: dataToken,
          recibir: true,
        })
      }else{
        console.log('ELSE TOKEN: ', dataToken);
        this.storeData(dataToken);
      }
    })
  }

  storeData = async (dataToken) =>{
    AsyncStorage.getItem('token').then(data => {
      let info = JSON.parse(data);
      console.log('ID DE SEGUNDA FUNCION', info.id);
      console.log('TOKEN DE SEGUNDA FUNCION', info.token);
      if (info.token != dataToken) {

        console.log(info);

        const datos= {
          id: info.id,
          token: dataToken,
        }

        AsyncStorage.setItem('token', JSON.stringify(datos))

        firestore().collection('tokens').doc(datos.id).update({
          token: datos.token,
        })

      }
    })
  }
  render() {
    console.log(this.state.token);
    return (
      <View style={{ backgroundColor: 'blue',flex: 1 }}>
        <WebView
          source={{ uri: this.state.url }}
        />
      </View>
    );
  }
}
