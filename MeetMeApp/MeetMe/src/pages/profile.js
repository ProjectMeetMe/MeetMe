import React, { Component } from 'react';
import { AppRegistry,View,Text,StyleSheet } from 'react-native';

export default class Profile extends Component{
	
	render(){
		return(
	  		<View style={styles.container}>	
				<Text style={styles.pageName}>I am user profile page.</Text>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container : {
	  backgroundColor:'#455a64',
	  flex: 1,
	  alignItems:'center',
	  justifyContent :'center'
	}
  });

AppRegistry.registerComponent('profile', () => profile);