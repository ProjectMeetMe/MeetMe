import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity 
} from "react-native";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";

export default class SignupForm extends Component {
  
  constructor(props){
		super(props);
		this.state={
      userFirstName:"",
      userLastName:"",
			userEmail:"", 
			userPassword:""				
		};
  }

  goBack() {
    Actions.pop();
}

  //Call signup API, send userFirstName, userLastName, userEmail
  //and userPassword as key value pair in the post API call and 
  //allow user to sign up a new account
  userSignup = () => {
		
    const {userFirstName} = this.state;
    const {userLastName} = this.state;
		const {userEmail} = this.state;
		const {userPassword} = this.state;
    var status = 400;
    //verify that user entered valid inputs
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(userEmail===""){
      Toast.show("Please enter your Email address!", Toast.LONG);
    }
    else if(reg.test(userEmail) === false)
		{
		  Toast.show("Sorry but seems like you did not enter a valid email address :(", Toast.LONG);
		}
		else if(userPassword===""){
      Toast.show("Please enter your password!", Toast.LONG);
    }
    else if(userPassword.length < 8 || userPassword.length > 16){
      Toast.show("Your password must be between 8 to 16 characters!", Toast.LONG);
    }
    else if(userFirstName===""){
      Toast.show("Please enter your first name!", Toast.LONG);
    }
    else if(userLastName===""){
      Toast.show("Please enter your last name!", Toast.LONG);
    }
    else
    {
      fetch("http://104.42.79.90:2990/auth/signup", {
        method: "POST",
        headers:{
        	"Accept": "application/json",
        	"Content-type": "application/json"
        },
        body:JSON.stringify({
          firstname : userFirstName,
          lastname : userLastName,
          email : userEmail,
          password : userPassword
        })

      })
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((responseJson) => { 
        //display success / fail message
        if(status === 200)    //success
        {
          this.goBack();    
        }
        Toast.show(responseJson.message, Toast.LONG);
      });
    }
  }
  
	render(){
		return(
			<View style={styles.container}>

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="First Name"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => this.password.focus()}
                    onChangeText= {(userFirstName) => this.setState({userFirstName})}
                />

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Last Name"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => this.password.focus()}
                    onChangeText= {(userLastName) => this.setState({userLastName})}
                />

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Email"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => this.password.focus()}
                    onChangeText= {(userEmail) => this.setState({userEmail})}
                />

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#ffffff"
                    ref={(input) => this.password = input}
                    onChangeText= {(userPassword)  => this.setState({userPassword})}
                /> 

                <TouchableOpacity onPress={this.userSignup} style={styles.button}>
                    <Text style={styles.buttonText}>{this.props.type}</Text>
                </TouchableOpacity>    

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
