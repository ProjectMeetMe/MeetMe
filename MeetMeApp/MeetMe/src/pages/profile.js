import React, { Component } from 'react';
import { AsyncStorage, AppRegistry,View,Text,StyleSheet } from 'react-native';
import NavBar from 'react-native-nav';
import NavigationForm from '../components/navigationForm';
import Toast from 'react-native-simple-toast';

export default class Profile extends Component{
  
  constructor() {

    super();

    this.state = {
      token: '',
    };

    AsyncStorage.getItem("token").then((value) => {
      if (value != ''){
        this.setState({token: value});
      } else {
        this.setState({token: ''});
      }
    }).done();
  }

	render(){
    const {token} = this.state;
    var name = '';
    var email = '';
    var userId = '';

    fetch('http://104.42.79.90:2990/user/profile', {
      method: 'GET',
      headers:{
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => response.json())
    .then((responseJson)=>{ 
      name = responseJson.firstname + " " + responseJson.lastname;
      email = responseJson.email;
      userId = responseJson.id;
    });

    if(token != '')
    {
      return(
        <View  style={{flex: 1}}>
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

  Text: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});