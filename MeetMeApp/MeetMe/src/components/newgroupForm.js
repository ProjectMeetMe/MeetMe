import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard 
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Actions} from 'react-native-router-flux';

export default class NewGroupForm extends Component {

  constructor(props){
		super(props)
		this.state={
            
            newGroupName:'',
            token: '',
    }

    //Retrieve token from AsyncStorage and store token into 
    //global variable 
    AsyncStorage.getItem("token").then((value) => {
        if (value != ''){
          this.setState({token: value});
        } else {
          this.setState({token: ''});
        }
      }).done();
  }

  //Call newGroup API, send groupName as key value pair 
  //in the post API call and allow user to join a group
  newGroup = () =>{
    const {newGroupName, token} = this.state;
    
    //verify that user entered a valid group name
		if(newGroupName==""){
		  Toast.show('Please enter the group name!', Toast.LONG);		
		}
    else if(newGroupName.length < 5 || newGroupName.length > 32){
      Toast.show('Your password must be between 5 to 32 characters!', Toast.LONG);
    }
    else{
		  fetch('http://104.42.79.90:2990/group/createGroup',{
			  method:'post',
			  headers:{
				        'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
			  },
			  body:JSON.stringify({
				    groupName: newGroupName,
			  })			
		  })
		    .then((response) => response.json())
		    .then((responseJson)=>{
          //display success / fail message
          if(responseJson.message != "")
          {
              Toast.show(responseJson.message, Toast.LONG);
          }
     });
    }
    Keyboard.dismiss();
	}

	render(){
		return(
			<View style={styles.container}>
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Your Group Name"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={newGroupName => this.setState({newGroupName})}
                />


                <TouchableOpacity style={styles.button} onPress={this.newGroup}>
                    <Text style={styles.buttonText}>{this.props.type}</Text>
                </TouchableOpacity>    
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
