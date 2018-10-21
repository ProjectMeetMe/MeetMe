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
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/AntDesign';

export default class GroupProfile extends Component {

  constructor(props){
		super(props)
		this.state={
            
        events:[],
        token: '',
        userid: '',
        groupinfo: '',
        groupID: 0,
    }
  }

  componentDidMount() {
    this.getEvents();
    this.getGroupInfo();
  }
  
  async getEvents()
  {
    const { events, token} = this.state;
    const usertoken = await AsyncStorage.getItem("token");

    groupId = this.props.groupID;

    var userevents = await fetch('http://104.42.79.90:2990/event/getEvents?groupId=${encodeURIComponent(groupId)}', {
          method: 'get',
          headers:{
            'Authorization': 'Bearer ' + usertoken
          }
        });

    const userevent = await userevents.json();

    this.setState({
      token: usertoken,
      events: userevent.events,
    });
  }

  async getGroupInfo()
  {
    const { events, token, userid} = this.state;
    const usertoken = await AsyncStorage.getItem("token");
    const curuserid = await AsyncStorage.getItem("userid");

    groupId = this.props.groupID;

    console.log("groupId:  " + groupId);

    var groupInfos = await fetch('http://104.42.79.90:2990/group/getGroup?groupId=' + groupId, {
          method: 'get',
          headers:{
            'Authorization': 'Bearer ' + usertoken
          }
        });

    const groupinfojson = await groupInfos.json();
    
    console.log("current user id:  " + curuserid);
    console.log("group owner id:  " + groupinfojson.groupInfo.leaderId);
    
    this.setState({
      token: usertoken,
      groupinfo: groupinfojson.groupInfo,
      userid: curuserid,
      groupID: groupId,
    });
  }

  renderCreateEvent(){
    if(this.state.userid == this.state.groupinfo.leaderId)
    {
      return(
        <ActionButton.Item buttonColor='#3498db' title="Create Event"
        textStyle = {styles.itemStyle} 
        textContainerStyle = {styles.itemStyle}
        onPress={() => {Actions.createevent({groupID: 4})}}>
        <Icon name="pluscircleo" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      );          
    }
  }

	render(){
    const { events, token, userid, groupinfo, groupID} = this.state;

      return(
        <View style={{flex: 1}}>
        <NavigationForm type={this.props.groupName}></NavigationForm>
          <View style={styles.container}>	
          <Text style={styles.Text}>I am group profile page for group {this.state.groupID}.</Text>
          </View>
          <ActionButton buttonColor="rgba(231,76,60,1)">
              <ActionButton.Item buttonColor='#9b59b6' title="Group Chat" 
                textStyle = {styles.itemStyle}
                textContainerStyle = {styles.itemStyle}
                onPress={() => {Toast.show("Group Chat")}}>
                {<Icon name="message1" style={styles.actionButtonIcon} />}
              </ActionButton.Item>
              { this.renderCreateEvent() }
            </ActionButton>
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

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: '#1c313a',
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
  },

  itemStyle: {
    backgroundColor: '#1c313a',
    color: '#ffffff'
  }
  
});