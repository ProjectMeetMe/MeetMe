import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard 
} from 'react-native';
import Toast from 'react-native-simple-toast';
//import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

export default class LoginFrom extends Component {

  constructor(props){
		super(props)
		this.state={
			userEmail:'',
			userPassword:''
    }
  }

  login = () =>{
		const {userEmail,userPassword} = this.state;
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(userEmail==""){
		  Toast.show('Please enter your email address!', Toast.LONG);		
		}
		
		else if(reg.test(userEmail) === false)
		{
		  Toast.show('Sorry but seems like you did not enter a valid email address :(', Toast.LONG);
		  }

		else if(userPassword==""){
		this.setState({email:'Please enter your password'})
		}
		else{
		
		fetch('http://104.42.79.90:2990/auth/signin',{
			method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				email: userEmail,
				password: userPassword
			})
			
		})
		.then((response) => response.json())
		 .then((responseJson)=>{
      Toast.show(JSON.stringify(responseJson))
			//  if(responseJson == "ok"){
			// 	 // redirect to profile page
			// 	 alert("Successfully Login");
			// 	 this.props.navigation.navigate("Profile");
			//  }else{
			// 	 alert("Wrong Login Details");
			//  }
		 });
		}
		
		Keyboard.dismiss();
	}
    


	render(){
		return(
			<View style={styles.container}>
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Email"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={userEmail => this.setState({userEmail})}
                />

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#ffffff"
                    ref={(input) => this.password = input}
                    onChangeText={userPassword => this.setState({userPassword})}
                /> 

                <TouchableOpacity style={styles.button} onPress={this.login}>
                    <Text style={styles.buttonText}>{this.props.type}</Text>
                </TouchableOpacity>    

                {/* <GoogleSigninButton style={{ width: 48, height: 48 }}
                      size={GoogleSigninButton.Size.Icon}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={this._signIn}
                      disabled={this.state.isSigninInProgress} />  */}
  		</View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});