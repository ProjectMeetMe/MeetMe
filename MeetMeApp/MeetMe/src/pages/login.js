import React, { Component } from "react";
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Logo from "../components/logo";
import LoginFrom from "../components/loginForm";
import { StackNavigator } from "react-navigation";
import Dialog, {
  DialogTitle,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';
import {Actions} from "react-native-router-flux";
import SimpleToast from "react-native-simple-toast";

export default class Login extends Component {
	constructor(props){
		super(props);
		this.state={
            
				email: "",
				passwordDialog: false,
    };
  }
	
	//Redirect page to signup view
	signup() {
		Actions.signup();
	}

	forgotPassword() {
		SimpleToast.show("forgot password");
	}
	resetPassword = () =>{
		//console.log(this.state.email)
		fetch("http://104.42.79.90:2990/auth/forgotPassword" ,{
			      method:"post",
			      headers:{
				              "Accept": "application/json",
                              "Content-type": "application/json",
			      },
			      body:JSON.stringify({
                      email: this.state.email,
            })			
		      })

		  	.then((response) => response.json())
       	.then((responseJson) => {
          Toast.show(responseJson.message, Toast.LONG);
       });
	}
					
	renderPasswordDialog() {
		return(
			<Dialog
				//dialogStyle={styles.dialogStyle}
				onDismiss={() => {
					this.setState({ passwordDialog: false });
				}}
				onTouchOutside={() => {
					this.setState({ passwordDialog: false });
				}}
				rounded={false}
				width={0.9}
				visible={this.state.passwordDialog}
				dialogTitle={
					<DialogTitle
						title={"Input your email"}
						textStyle={styles.dialogTitle}
						hasTitleBar={this.state.passwordDialog}
						align="center"
					/>
				}
				actions={[
					<DialogButton
						text="CANCEL"
						onPress={() => {
							this.setState({ passwordDialog: false });
						}}
						key="cancel"
						style={styles.dialogButton}
						textStyle={styles.cancelButtonText}
					/>,
					<DialogButton
						text="RESET PASSWORD"
						onPress={() => {

							this.resetPassword();
							this.setState({ passwordDialog: false });
						}}
						key="save"
						style={styles.dialogButton}
						textStyle={styles.deleteButtonText}
					/>,
				]}
			>
			<DialogContent>
				{
					<TextInput style={styles.inputBox} 
					//textAlignVertical={"top"}
					underlineColorAndroid="rgb(240,240,240)" 
					placeholder={"Your email"}
					selectionColor="#000000"
					keyboardType="email-address"
					onChangeText={(email) => this.setState({email})}
					
			/>
				}
			</DialogContent>
			</Dialog>
		);   
	}    
	showDialog = () =>{
		this.setState({
			passwordDialog: true,
		})
	}



	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<LoginFrom type="Login"/>
				<View style={styles.signupTextCont}>
					<TouchableOpacity onPress={this.showDialog}>	 
						<Text style={styles.signupButton}>Forgot my password</Text>
					</TouchableOpacity> 
				</View>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={this.signup}>	
						<Text style={styles.signupButton}> Signup</Text>
					</TouchableOpacity>
					{ this.renderPasswordDialog() }
					
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
  signupTextCont : {
  	flexGrow: 1,
    alignItems:"flex-end",
    justifyContent :"center",
    paddingVertical:16,
    flexDirection:"row"
  },
  signupText: {
  	color:"rgba(255,255,255,0.6)",
  	fontSize:16
  },
  signupButton: {
  	color:"#ffffff",
  	fontSize:16,
  	fontWeight:"500"
	},
	
  dialogStyle: {
    backgroundColor: "#212121",
},

  dialogTitle: {
    fontSize:16,
    fontWeight:"200",
    color:"#000000",
    textAlign:"center",
},

  deleteButtonText: {
    fontSize:14,
    fontWeight:"300",
    color:"#CB3333",
    textAlign:"center",
},

  cancelButtonText: {
    fontSize:14,
    fontWeight:"200",
    color:"#000000",
    textAlign:"center",
},

  dialogButton: {
    backgroundColor: "#CB3333",
},

inputBox: {
	width:300,
	backgroundColor:"rgba(255, 255,255,0.2)",
	borderRadius: 25,
	paddingHorizontal:16,
	fontSize:16,
	color:"#000000",
	marginVertical: 10
},
});

AppRegistry.registerComponent("login", () => login);
