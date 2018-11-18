import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from "react-native";
import Toast from "react-native-simple-toast";
import Logo from "../components/logo";
import SignupForm from "../components/signupForm";
import {Actions} from "react-native-router-flux";


export default class Signup extends Component {

  //Redirect page to signin view
  goBack() {
      Actions.pop();
  }
  //TODO: implement return to login screen after creaing account successfully
	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<SignupForm type="Signup"/>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Already have an account?</Text>
					<TouchableOpacity onPress={this.goBack}
          accessible={true} accessibilityLabel={'RedirectSignup'}><Text style={styles.signupButton}> Sign in</Text></TouchableOpacity>
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

