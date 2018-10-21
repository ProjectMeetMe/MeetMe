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
      profile: '',
    };

  }

  componentDidMount() {
    const {profile, token, isTokenrdy, isProfilerdy, isLoading} 
              = this.state;

    this.getProfile();
  }

  async getProfile()
  {
    const usertoken = await AsyncStorage.getItem("token");

    var userprofile = await fetch('http://104.42.79.90:2990/user/profile', {
      method: 'GET',
      headers:{
        'Authorization': 'Bearer ' + usertoken
      }
    });

    var profile = userprofile.json();

    this.setState({
      token: usertoken,
      profile: profile,
    });
  }

	render(){
    const {profile, token, isProfilerdy} = this.state;
    //Toast.show(profile, Toast.LONG);
      return(
        <View  style={{flex: 1}}>
        <NavigationForm type="Profile"></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>I am profile page.{'\n'}{'\n'}
          {this.state.profile}{'\n'}{'\n'}
          {this.state.profile.name}{'\n'}{'\n'}
          {this.state.profile.email}{'\n'}{'\n'}
          {this.state.profile.id}{'\n'}{'\n'}
          {this.state.token}</Text>
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

  Text: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});