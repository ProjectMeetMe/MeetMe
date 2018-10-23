import React, { Component } from 'react';
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import JoinGroupForm from '../components/joingroupForm';
import NavigationForm from '../components/navigationForm';

export default class JoinGroup extends Component {

  //TODO: return to homepage and refresh upon successful join
	render() {
		return(
			<View style={{flex: 1}}>
      <NavigationForm type="Join A Group"></NavigationForm>
      <View style={styles.container}>
				<JoinGroupForm type="Join Group"/>
        </View>
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
