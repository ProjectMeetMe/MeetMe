import React, { Component } from "react";
import { AsyncStorage, AppRegistry, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavBar from "react-native-nav";
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
    console.log("profilejson:", profilejson);

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
    //Toast.show(profile, Toast.LONG);
      return(
        <View  style={{flex: 1}}>
        <NavigationForm title="Profile" type="profile"></NavigationForm>
          <View style={styles.container}>
              {/* <Text style={styles.Text}>I am profile page. </Text>
              <Text style={styles.Text}>{this.state.name}</Text>
              <Text style={styles.Text}>{this.state.email}</Text>
              <Text style={styles.Text}>{this.state.id}</Text> */}
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
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"#455a64",
    flexDirection: "row",
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
     borderRadius: 10,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },
  
});