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
import NavigationForm from '../components/navigationForm';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class GroupProfile extends Component {

  constructor(props){
		super(props)
		this.state={
            
        events:[],
        token: '',
    }
  }

  componentDidMount() {
    this.getEvents();
  }

  async getEvents()
  {
    const { events, token} = this.state;
    const usertoken = await AsyncStorage.getItem("token");
    console.log("usertoken:  " + usertoken);

    groupId = this.props.groupID;

    var userevents = await fetch('http://104.42.79.90:2990/event/getEvents?groupId=${encodeURIComponent(groupId)}', {
          method: 'get',
          headers:{
            'Authorization': 'Bearer ' + usertoken
          }
        });

    const userevent = await userevents.json();

    console.log("userevent:  " + userevent);
    console.log("userevent.toString:  " + userevent.toString);
    console.log("JSON.stringify(userevent):  " + JSON.stringify(userevent));
    
    this.setState({
      token: usertoken,
      events: userevent.events,
    });
  }

	render(){
		return(
      <View style={{flex: 1}}>
      <NavigationForm type={this.props.groupName}></NavigationForm>
	  		<View style={styles.container}>	
				<Text style={styles.Text}>I am group profile page for group {this.props.groupID}.</Text>
			  </View>
      </View> 
		);
	}
}

const styles = StyleSheet.create({

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
  },

  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#455a64',
    flexDirection: 'row',
  },
  
  button: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },

  Text: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});