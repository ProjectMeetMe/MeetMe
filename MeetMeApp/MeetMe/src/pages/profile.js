import React, { Component } from "react";
import { AsyncStorage, AppRegistry, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";
import PushNotification from 'react-native-push-notification';

export default class Profile extends Component{
  
  constructor(onRegister, onNotification) {

    super();

    this.state = {
      token: "",
      profile: "",
      name: "",
      email: "",
      id:  "",
    };

    this.configure(onRegister, onNotification);
  }

  componentDidMount() {
    //this.configure(onRegister, onNotification);
    this.getProfile();
  }

  configure(onRegister, onNotification, gcm = "") {
    PushNotification.configure({
      onRegister: onRegister, //this._onRegister.bind(this),
      onNotification: onNotification, //this._onNotification,
      senderID: gcm,
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  localNotif() {
    PushNotification.localNotification({
      ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      //bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "Notification Center", // (optional) default: none
      color: "green", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: "group", // (optional) add group to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification

      title: "Local Notification", // (optional)
      message: "My Notification Message", // (required)
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      actions: '["Check Notifications", "Cancel"]',  // (Android only) See the doc for notification actions to know more
    });
  }

  scheduleNotif() {
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (30 * 1000)), // in 30 secs

      /* Android Only Properties */
      ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
      color: "blue", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: "group", // (optional) add group to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification

      /* iOS and Android properties */
      title: "Scheduled Notification", // (optional)
      message: "My Notification Message", // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: ''+this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
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
    //console.log("profilejson:", profilejson);

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

              <TouchableOpacity style={styles.scheduleButton} onPress={() =>{this.localNotif();}}>
                  <Text style={styles.buttonText}>Test Push Notification</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.scheduleButton} onPress={() =>{Actions.notifications();}}>
                  <Text style={styles.buttonText}>My Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.scheduleButton}  onPress={() => {Actions.usercalendar()}}>
                  <Text style={styles.buttonText}>My Schedule</Text>
              </TouchableOpacity> 

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
    backgroundColor:"#90EE90",
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