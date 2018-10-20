import React, { Component } from 'react';
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NewGroupForm from '../components/newgroupForm';

export default class CreateGroup extends Component {

	render() {
		return(
			<View style={styles.container}>
				<NewGroupForm type="Create Group"/>
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

AppRegistry.registerComponent('creategroup', () => creategroup);
