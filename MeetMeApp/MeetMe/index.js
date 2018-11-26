/** @format */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from "./App";
  
export default class Index extends Component{
    constructor(props) {
		super(props);
    };
      
    componentWillMount(){
        console.log("I am beginning: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    }
}

AppRegistry.registerComponent("MeetMe", () => App);

