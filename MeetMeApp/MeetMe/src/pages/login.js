import React, { Component } from "react";
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Logo from "../components/logo";
import LoginFrom from "../components/loginForm";
import { StackNavigator } from "react-navigation";

import {Actions} from "react-native-router-flux";

export default class Login extends Component {

	//Redirect page to signup view
	signup() {
		Actions.signup();
	}

	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<LoginFrom type="Login"/>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={this.signup}>	
						<Text style={styles.signupButton}> Signup</Text>
					</TouchableOpacity>
				</View>
			</View>	
			);
	}
}
const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    alignItems:"center",
    justifyContent :"center"
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:"flex-end",
    justifyContent :"center",
    paddingVertical:16,
    flexDirection:"row"
  },
  signupText: {
  	color:"rgba(255,255,255,0.6)",
  	fontSize:16
  },
  signupButton: {
  	color:"#ffffff",
  	fontSize:16,
  	fontWeight:"500"
  }
});

AppRegistry.registerComponent("login", () => login);
