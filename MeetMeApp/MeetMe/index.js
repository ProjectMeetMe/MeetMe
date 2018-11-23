/** @format */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import BackgroundTask from 'react-native-background-task'
import App from "./App";
import {name as appName} from "./app.json";
  
export default class Index extends Component{
    constructor(props) {
		super(props);
    };
      
    componentWillMount(){
        console.log("I am beginning: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    }
}

AppRegistry.registerComponent("MeetMe", () => App);

