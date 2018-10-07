import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Logo from '../components/logo';
import SignupForm from '../components/signupForm';
import {Actions} from 'react-native-router-flux';


export default class Signup extends Component {

  goBack() {
      Actions.pop();
  }
  
	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<SignupForm type="Signup"/>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Already have an account?</Text>
					<TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}> Sign in</Text></TouchableOpacity>
				</View>
			</View>	
			)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#455a64',
  },

  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  Text: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});

AppRegistry.registerComponent('signup', () => signup);