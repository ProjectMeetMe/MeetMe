import React, { Component } from "react";
import { AsyncStorage, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavigationForm from "../components/navigationForm";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";

export default class Profile extends Component{
  
  constructor() {

    super();

    this.state = {
      token: "",
      profile: "",
      name: "",
      email: "",
      id:  "",
    };

  }

  componentDidMount() {
    this.getProfile();
  }


  async getProfile()
  {

    const {profile, token, name, email, id} = this.state;

    const usertoken = await AsyncStorage.getItem("token");

    var userprofile = await fetch("http://104.42.79.90:2990/user/profile", {
      method: "GET",
      headers:{
        "Authorization": "Bearer " + usertoken
      }
    });

    var profilejson = await userprofile.json();

    this.setState({
      token: usertoken,
      profile: profilejson,
      name: profilejson.firstname +"  " + profilejson.lastname,
      email: profilejson.email,
      id:  profilejson.id,
    });
  }

logout = async() => {
  AsyncStorage.clear();
  Toast.show("Log out successfully!", Toast.LONG);
  this.login();
  Actions.reset("login");
  //Actions.popTo("login");
}

login() {
  Actions.login();
}

	render(){
    const {profile, token, name, email, id} = this.state;
      return(
        <View  style={{flex: 1}}>
        <NavigationForm title="Profile" type="profile"></NavigationForm>
          <View style={styles.container}>

              <TouchableOpacity style={styles.scheduleButton} onPress={() =>{Actions.notifications();}}>
                  <Text style={styles.buttonText}>My Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.scheduleButton}  onPress={() => {Actions.usercalendar()}}>
                  <Text style={styles.buttonText}>My Schedule</Text>
              </TouchableOpacity> 
         </View>
         
          <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={this.logout}>
                  <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>  
          </View>
        </View> 
      );
    }
	}

const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    alignItems:"center",
    justifyContent :"center"
  },

  profileTextCont : {
  	flexGrow: 1,
    alignItems:"flex-end",
    justifyContent :"center",
    paddingVertical:16,
    flexDirection:"row"
  },

  Text: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  }, 

  button: {
    width:300,
    backgroundColor:"#CB3333",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    paddingHorizontal:16,
  },

  scheduleButton: {
    width:300,
    backgroundColor:"#1BB21B",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    paddingHorizontal:16,
  },
  
  buttonText: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },
  
});