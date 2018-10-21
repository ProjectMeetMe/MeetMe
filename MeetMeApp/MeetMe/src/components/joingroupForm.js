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

export default class JoinGroupForm extends Component {

  constructor(props){
		super(props)
		this.state={
            
            joinGroupID:'',
            token: '',
            userid: '',
    }

    AsyncStorage.getItem("token").then((value) => {
          this.setState({token: value});
      }).done();

      AsyncStorage.getItem("userid").then((value) => {
        this.setState({userid: value});
    }).done();
  }

  joinGroup = () =>{
    const {joinGroupID, token, userid} = this.state;
    
    console.log("userid    " + userid);

		if(joinGroupID==""){
		  Toast.show('Please enter the group id!', Toast.LONG);		
    }
    
		else{
		    fetch('http://104.42.79.90:2990/group/joinGroup',{
			      method:'post',
			      headers:{
				              'Accept': 'application/json',
                      'Content-type': 'application/json',
                      'Authorization': 'Bearer ' + token,
			              },
			      body:JSON.stringify({
                      groupId: joinGroupID,
                      id:      userid, 
			      })			
		      })
		        .then((response) => response.json())
		        .then((responseJson)=>{
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
                    placeholder="Group ID"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={joinGroupID => this.setState({joinGroupID})}
                />


                <TouchableOpacity style={styles.button} onPress={this.joinGroup}>
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
