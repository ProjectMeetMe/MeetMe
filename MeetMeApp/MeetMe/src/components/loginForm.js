import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard 
} from "react-native";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";

export default class LoginFrom extends Component {

  constructor(props){
		super(props);
		this.state={
			userEmail:"",
      userPassword:""
    };
  
  }

  //Save user token into AsyncStorage
  async saveToken(value) {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (error) {
      //console.log("Error saving data" + error);
    }
  }

  //Save user ID into AsyncStorage
  async saveUserID(value) {
    try {
      await AsyncStorage.setItem("userid", value.toString());
    } catch (error) {
      //console.log("Error saving data" + error);
    }
  }

  //Redirect app to home page
  home() {
		Actions.home();
  }


  //Call signin post API to achieve user login
  login = () => {
		const {userEmail,userPassword} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    var token;

    //verify that the user has entered valid input
		if(userEmail === ""){
		  Toast.show("Please enter your email address!", Toast.LONG);
		}
		
		else if(reg.test(userEmail) === false)
		{
		  Toast.show("Sorry but seems like you did not enter a valid email address :(", Toast.LONG);
		  }

		else if(userPassword === ""){
      Toast.show("Please enter your password!", Toast.LONG);
		}
		else{

      //Call joinGroup API, send user email and password
      //as key value pair in the post API call
      fetch("http://104.42.79.90:2990/auth/signin",{
        method:"post",
        headers:{
          "Accept": "application/json",
          "Content-type": "application/json"
        },
        body:JSON.stringify({
          email: userEmail,
          password: userPassword
        })
        
      })
      .then((response) => response.json())
       .then((responseJson) => {
         //Display the reason why login failed if failed,
         //Otherwise app keep finishing log in
         if(responseJson.message !== "Successful login")
         {
          Toast.show(responseJson.message, Toast.LONG);
         }
         else
         {
          token = responseJson.token;
  
          //save token to asyncstorage 
          this.saveToken(token);
          this.saveUserID(responseJson.user.id);
  
          //Login success, redirect view to home page
          //this.home();
          Actions.reset("home");
          //Actions.popTo("home");
         }
       });
    }
    Keyboard.dismiss();
	}

	render(){
		return(
			<View style={styles.container}>
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Email"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => this.password.focus()}
                    onChangeText={(userEmail) => this.setState({userEmail})}
                />

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#ffffff"
                    ref={(input) => this.password = input}
                    onChangeText={(userPassword) => this.setState({userPassword})}
                /> 

                <TouchableOpacity style={styles.button} onPress={this.login}>
                    <Text style={styles.buttonText}>{this.props.type}</Text>
                </TouchableOpacity>    

                {/* { <GoogleSigninButton style={{ width: 48, height: 48 }}
                      size={GoogleSigninButton.Size.Icon}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={this._signIn}
                      disabled={this.state.isSigninInProgress} />  } */}
      </View>
			);
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center"
  },

  inputBox: {
    width:300,
    backgroundColor:"rgba(255, 255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:"#ffffff",
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:"#1c313a",
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  }
  
});
