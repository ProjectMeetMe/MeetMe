import React, { Component } from 'react';
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import JoinGroupForm from '../components/joingroupForm';

export default class JoinGroup extends Component {

	render() {
		return(
			<View style={styles.container}>
				<JoinGroupForm type="Join Group"/>
			</View>	
			)
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
  	fontSize:16
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:16,
  	fontWeight:'500'
  }
});
