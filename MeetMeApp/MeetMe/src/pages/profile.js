import React, { Component } from 'react';
import { AsyncStorage, AppRegistry,View,Text,StyleSheet } from 'react-native';
import NavBar from 'react-native-nav';
import NavigationForm from '../components/navigationForm';
import Toast from 'react-native-simple-toast';

export default class Profile extends Component{
  
  constructor() {

    super();

    this.state = {
      token: null,
    };

    AsyncStorage.getItem("token").then((value) => {
      if (value != null){
        this.setState({token: value});
      } else {
        this.setState({token: null});
      }
    }).done();

  }

	render(){
    const {token} = this.state;
    if(token != null)
    {
      return(
        <View >
        <NavigationForm type="Profile"></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>I am profile page.{'\n'}{'\n'}
          This is token.{'\n'}{'\n'}
          {this.state.token}</Text>
          </View>
        </View> 
      );
    }
    else
    {
      return(
        <View >
        <NavigationForm type="Profile"></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>Profile page can not render.</Text>
          </View>
        </View> 
      );
    }

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