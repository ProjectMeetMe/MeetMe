import React, { Component } from "react";
import { AsyncStorage, AppRegistry,View,Text,StyleSheet } from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import Toast from "react-native-simple-toast";

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

	render(){
    const {profile, token, name, email, id} = this.state;
    //Toast.show(profile, Toast.LONG);
      return(
        <View  style={{flex: 1}}>
        <NavigationForm title="Profile" type="profile"></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>I am profile page.{"\n"}{"\n"}
          {this.state.name}{"\n"}{"\n"}
          {this.state.email}{"\n"}{"\n"}
          {this.state.id}
          </Text>
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

  Text: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  }
  
});