import React, { Component } from 'react';
import { AsyncStorage, AppRegistry,View,Text,StyleSheet } from 'react-native';
import NavBar from 'react-native-nav';
import NavigationForm from '../components/navigationForm';

export default class Home extends Component{
	
	render(){
		return(
      <View >
      <NavigationForm type="Home"></NavigationForm>
	  		<View style={styles.container}>	
				<Text style={styles.Text}>I am home page.</Text>
			  </View>
      </View> 
		);
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#455a64',
    flexDirection: 'row',
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
