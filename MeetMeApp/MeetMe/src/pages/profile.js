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
      isTokenrdy: false,
      isProfilerdy: false,
      isLoading: false,
    };

  }

  async getProfile() {
    try {
      return await AsyncStorage.getItem('profile');
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }


  componentDidMount() {
    const {profile, token, isTokenrdy, isProfilerdy, isLoading} 
              = this.state;

    // AsyncStorage.getItem("token").then((value) => {
    //     this.setState({
    //         token: value,
    //         isTokenrdy: true,
    //     });
    //   Toast.show("Token is received form asyncstraoge, set frag to treu", Toast.LONG);
    // }).done();

    //this.getToken();
    
    //var gettoken = this.getToken();
    //var getprofile = this.getProfile();

    // this.setState({
    //   token: gettoken,
    //   profile: getprofile,
    // });

    //this.makeRemoteRequest();

    this.getProfile();
  }

  async getProfile()
  {
    const usertoken = await AsyncStorage.getItem("token");

    Toast.show(usertoken, Toast.LONG);
    console.log("usertoken:  " + usertoken);
    var userprofile = await fetch('http://104.42.79.90:2990/user/profile', {
      method: 'GET',
      headers:{
        'Authorization': 'Bearer ' + usertoken
      }
    });

    var profile = userprofile.json();
    console.log("userprofile:  " + userprofile);
    console.log("profile:  " + profile);
    console.log("userprofile.toString():  " + userprofile.toString());
    console.log("profile.toString():  " + profile.toString());
    console.log("JSON.stringify(userprofile):  " + JSON.stringify(userprofile));
    console.log("JSON.stringify(profile):  " + JSON.stringify(profile));
   // Toast.show(userprofile.toString(), Toast.LONG);

    this.setState({
      token: usertoken,
      profile: JSON.stringify(userprofile),
    });
  }

  makeRemoteRequest = () => {
    const {profile, token, isTokenrdy, isProfilerdy, isLoading} 
            = this.state;

    console.log("token:  " + token);

    fetch('http://104.42.79.90:2990/user/profile', {
      method: 'GET',
      headers:{
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => response.json())
    .then((responseJson)=>{ 
      this.setState({
        profile: responseJson,
        isProfilerdy: true,
      });
    });
  };

	render(){
    const {profile, token, isProfilerdy} = this.state;
    //Toast.show(profile, Toast.LONG);

    if(isProfilerdy == false)
    {
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
    else
    {
      return(
        <View  style={{flex: 1}}>
        <NavigationForm type="Profile"></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>Loading your profile...</Text>
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