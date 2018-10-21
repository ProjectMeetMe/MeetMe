import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard ,
  AutoGrowingTextInput,
  ScrollView 
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Actions} from 'react-native-router-flux';
import NavigationForm from '../components/navigationForm';

export default class CreateEvent extends Component {

  constructor(props){
		super(props)
		this.state={
            
            token: '',
            eventName: '',
            description: '',
            startTime: '',
            endTime: '',
            groupId: this.props.groupID,
    }

    AsyncStorage.getItem("token").then((value) => {
          this.setState({token: value});
      }).done();

  }

  addEvent = () =>{
    const {token, eventName, description, startTime, 
            endTime, groupId} = this.state;

    // var groupId = this.props.groupID;		
    console.log("groupId:  " + this.state.groupId);

		if(groupId=="111"){
		  Toast.show('Please enter the group id!', Toast.LONG);		
        }
    
		else{
		    fetch('http://104.42.79.90:2990/event/addEvent',{
			      method:'post',
			      headers:{
				              'Accept': 'application/json',
                              'Content-type': 'application/json',
                              'Authorization': 'Bearer ' + token,
			              },
			      body:JSON.stringify({
                      groupId:         groupId,
                      eventName:       eventName, 
                      description:     "We together are working on this fucking group mvp",
                      startTime:       "2018-10-21 11:00:00",
                      endTime:         "2018-10-21 12:30:00",
			      })			
		      })
		        .then((response) => response.json())
		        .then((responseJson)=>{
                    console.log("responseJson:  " + responseJson);
                    console.log("responseJson.message:  " + responseJson.message);
                    Toast.show('responseJson.message:   ' + responseJson.message, Toast.LONG);		
            });
    }
        Keyboard.dismiss();
}

	render(){
		return(
      <View style={{flex: 1, backgroundColor: '#455a64'}}>
      <NavigationForm type="Create New Event"></NavigationForm>
      <ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
                    <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Event Name"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={eventName => this.setState({eventName})}
                    />
                    
                    <TouchableOpacity style={styles.datebutton} 
                      onPress={ console.log("Start Time Clicked ")}>
                    <Text style={styles.datebuttonText}>{"Start Time"}</Text>
                    </TouchableOpacity>   

                     <TouchableOpacity style={styles.datebutton} 
                      onPress={ console.log("End Time Clicked ")}>
                    <Text style={styles.datebuttonText}>{"End Time"}</Text>
                    </TouchableOpacity>  

                    <TextInput style={styles.longInputBox} 
                    multiline={true}
                    textAlignVertical={'top'}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Event Description"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={description => this.setState({description})}
                />


                <TouchableOpacity style={styles.button} onPress={this.addEvent}>
                    <Text style={styles.buttonText}>{"Create Event"}</Text>
                </TouchableOpacity>    
  		</View>
      </ScrollView>
      </View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
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

  longInputBox: {
    minHeight: 100,
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
  },

  datebutton: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    paddingHorizontal:16,
  },
  datebuttonText: {
    fontSize:16,
    color:'#ffffff',
    textAlign:'left'
  }

});