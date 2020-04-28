import 'react-native-get-random-values';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

export default class MyWeb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://zonaturca.com/',
      loading: true,
    };
  }

  componentDidMount(){
    this.indentificarEntrada();
    this.activivarNotificaciones();
    this.permisoParaResivirNotificaiones();
    this.obtenerToken();
  }

  indentificarEntrada = async () =>{

    AsyncStorage.getItem('noti').then(data => {
      if (data == null) {
        const check = {
          url: 'https://zonaturca.com/'
        };
        AsyncStorage.setItem('noti', JSON.stringify(check))
        this.setState({
          loading: false,
        });
      }else{
        this.notificationVerificada();
      }
    })

}

  notificationVerificada = async () =>{
    firestore().collection('notification').doc('datos').get()
    .then(snapshot => {
      AsyncStorage.getItem('noti').then(data => {
        this.setState({
          loading: false,
        });
        let info = JSON.parse(data);
        if (info.url != snapshot.data().url) {
          this.setState({
            url: snapshot.data().url,
          });
          const check = {
            url: snapshot.data().url
          };
          AsyncStorage.setItem('noti', JSON.stringify(check))
        }
      })
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
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

  reiniciar(){
    RNRestart.Restart();
  }
  render() {
    console.log(this.state.token);
    if (this.state.loading == true) {
      return(
        <View style={{
          flex: 1,
          backgroundColor: '#111010',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image source={require('./assest/Zona_Turca.png')} style={{width: 60, height: 60, marginBottom: 10,}} />
          <ActivityIndicator size="large" color="#e30a17" />

        </View>
      );
    }else {
      return (
        <View style={{ backgroundColor: 'blue',flex: 1 }}>
          <WebView
            style={{backgroundColor: '#111010',}}
            source={{ uri: this.state.url }}
            renderError={errorName =>
              <View style={{
                flex: 1,
                backgroundColor: '#111010',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{color: '#ffffff', fontSize: 24, marginBottom: 10, }}>LO SENTIMOS 😭</Text>
                <Text style={{color: '#ffffff', fontSize: 18, marginBottom: 20, marginLeft: 30, marginRight: 30, textAlign: 'center',}}>Este error es debido a la publicidad de los reproductores gratuitos.{'\n'}{'\n'}Para evitar este problema te recomendamos hacerte miembro VIP 😍</Text>
                <TouchableOpacity onPress={this.reiniciar} style={{padding: 10, backgroundColor: '#e30a17', borderRadius: 10,}}>
                  <Text style={{color: '#ffffff', fontSize: 24,}}>Volver a cargar</Text>
                </TouchableOpacity>
              </View>}
          />
        </View>
      );
    }
  }
}
