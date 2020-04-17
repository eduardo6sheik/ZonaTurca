import 'react-native-get-random-values';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class MyWeb extends Component {
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
