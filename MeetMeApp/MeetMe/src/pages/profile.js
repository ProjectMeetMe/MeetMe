import React, { Component } from "react";
import { AsyncStorage, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import NavigationForm from "../components/navigationForm";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";
import Dialog, {
  DialogTitle,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';

export default class Profile extends Component{
  
  constructor() {

    super();

    this.state = {
      token: "",
      profile: "",
      name: "",
      email: "",
      id:  "",
      changePasswordDialog: false,
      oldPassword: "",
      newPassword: "", 
      confirmPassword: "",
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

  async saveToken(value) {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (error) {
      //console.log("Error saving data" + error);
    }
  }

  changePassword()
  {
    const usertoken = AsyncStorage.getItem("token");

    var passwordReset = fetch("http://104.42.79.90:2990/user/changePassword", {
          method: "post",
          headers:{
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + this.state.token,
          },
          body:JSON.stringify({
            oldPass: this.state.oldPassword,
            newPass: this.state.newPassword,
            confirmPass: this.state.confirmPassword
          })
        }).then((response) => {
          status = response.status;
          return response.json();
        })
        .then((responseJson) => {
          if(status === 200)    //success
          {
            Toast.show(responseJson.message, Toast.LONG);	
            this.setState({
              token: responseJson.token,
            });
            this.saveToken(responseJson.token);
          } else {
            Toast.show(responseJson.message, Toast.LONG);
          }
        });
  }

logout = async() => {
  AsyncStorage.clear();
  //Toast.show("Log out successfully!", Toast.LONG);
  this.login();
  Actions.reset("login");

}

login() {
  Actions.login();
}

renderPasswordDialog() {
  return(
    <Dialog
      onDismiss={() => {
        this.setState({ changePasswordDialog: false });
      }}
      onTouchOutside={() => {
        this.setState({ changePasswordDialog: false });
      }}
      rounded={false}
      width={0.9}
      visible={this.state.changePasswordDialog}
      dialogTitle={
        <DialogTitle
          title={"Change Your Password"}
          textStyle={styles.dialogTitle}
          hasTitleBar={this.state.changePasswordDialog}
          align="center"
        />
      }
      actions={[
        <DialogButton
          text="CANCEL"
          onPress={() => {
            this.setState({ changePasswordDialog: false });
          }}
          key="cancel"
          style={styles.dialogButton}
          textStyle={styles.cancelButtonText}
        />,
        <DialogButton
          text="SAVE"
          onPress={() => {
            if(this.state.oldPassword === "" || this.state.newPassword === "" || this.state.confirmPassword === ""){
              Toast.show("Please enter the required* fields", Toast.SHORT);
            } else if(this.state.newPassword.length < 8 || this.state.confirmPassword.length < 8) {
              Toast.show("New Password must be 8 or more characters", Toast.SHORT);
            } else{
            this.changePassword();
            this.setState({ changePasswordDialog: false });
            }
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
        secureTextEntry={true}  
        underlineColorAndroid="rgba(0,0,0,0)" 
        placeholder="Old Password*"
        placeholderTextColor = "#000000"
        selectionColor="#000"
        onChangeText={(oldPassword) => this.setState({oldPassword})}
        />
      }
    </DialogContent>
    <DialogContent>
      {
        <TextInput style={styles.inputBox} 
        secureTextEntry={true}  
        underlineColorAndroid="rgba(0,0,0,0)" 
        placeholder="New Password*"
        placeholderTextColor = "#000000"
        selectionColor="#000"
        onChangeText={(newPassword) => this.setState({newPassword})}
        />
      }
    </DialogContent>
    <DialogContent>
      {
        <TextInput style={styles.inputBox} 
        secureTextEntry={true}  
        underlineColorAndroid="rgba(0,0,0,0)" 
        placeholder="Confirm New Password*"
        placeholderTextColor = "#000000"
        selectionColor="#000"
        onChangeText={(confirmPassword) => this.setState({confirmPassword})}
        />
      }
    </DialogContent>
    </Dialog>
  );   
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
              <TouchableOpacity style={styles.scheduleButton}  onPress={() => {this.setState({changePasswordDialog: true})}}>
                  <Text style={styles.buttonText}>Change My Password</Text>
              </TouchableOpacity> 
         </View>

          <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={this.logout}>
                  <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>  
          </View>
          { this.renderPasswordDialog() }
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
  inputBox: {
    
    width:300,
    backgroundColor:"rgb(245, 245, 245)",
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:"#000000",
    marginVertical: 10
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
    fontSize:20,
    fontWeight:"300",
    color:"#CB3333",
    textAlign:"center",
},

  cancelButtonText: {
    fontSize:16,
    fontWeight:"200",
    color:"#000000",
    textAlign:"center",
},

  dialogButton: {
    backgroundColor: "#CB3333",
},
});