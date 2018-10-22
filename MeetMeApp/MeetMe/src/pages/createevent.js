import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  String,
  TextInput,
  TouchableOpacity,
  Keyboard ,
  AutoGrowingTextInput,
  ScrollView 
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Actions} from 'react-native-router-flux';
import NavigationForm from '../components/navigationForm';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
            startDateTimePickerVisible: false,
            endDateTimePickerVisible: false,
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
                      description:     "We together are working on this group mvp",
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

showStartDateTimePicker  = () => this.setState({ startDateTimePickerVisible: true });

hideStartDateTimePicker  = () => this.setState({ startDateTimePickerVisible: false });

handleStartDatePicked  = (date) => {
  console.log('Start Time has been picked: ', date);
  var dateString = date.toString();
  // E.G: dateString = Sun Oct 21 2018 17:38:00 GMT-700 (PDT)
  var dateStringArray = dateString.split(" ",5);
  var day = dateStringArray[2];
  var month;
  var year = dateStringArray[3];
  var time = dateStringArray[4];
  var dateOutString
      switch(dateStringArray[1]) {
        case "Jan":
          month = 1;
          break;
        case "Feb":
          month = 2;
          break;
        case "Mar":
          month = 3;
          break;
        case "Apr":
          month = 4;
          break;
        case "May":
          month = 5;
          break;
        case "Jun":
          month = 6;
          break;
        case "Jul":
          month = 7;
          break;
        case "Aug":
          month = 8;
          break;
        case "Sep":
          month = 9;
          break;
        case "Oct":
          month = 10;
          break;
        case "Nov":
          month = 11;
          break;
        case "Dec":
          month = 12;
          break;
        // In case of ERROR
        default:
          month = 13;
      }
  dateOutString = year + "-" + month + "-" + day + " " + time;
  this.setState({startTime: dateOutString});
  this.hideStartDateTimePicker();
};

showEndDateTimePicker  = () => this.setState({ endDateTimePickerVisible: true });

hideEndDateTimePicker  = () => this.setState({ endDateTimePickerVisible: false });

handleEndDatePicked  = (date) => {
  console.log('End Time has been picked: ', date);
  var dateString = date.toString();
  //[0] = dayName; [1] = month; [2] = dayNum; [3] yearNum, [4] time
  var dateStringArray = dateString.split(" ",5);
  var day = dateStringArray[2];
  var month;
  var year = dateStringArray[3];
  var time = dateStringArray[4];
  var dateOutString
      switch(dateStringArray[1]) {
        case "Jan":
          month = 1;
          break;
        case "Feb":
          month = 2;
          break;
        case "Mar":
          month = 3;
          break;
        case "Apr":
          month = 4;
          break;
        case "May":
          month = 5;
          break;
        case "Jun":
          month = 6;
          break;
        case "Jul":
          month = 7;
          break;
        case "Aug":
          month = 8;
          break;
        case "Sep":
          month = 9;
          break;
        case "Oct":
          month = 10;
          break;
        case "Nov":
          month = 11;
          break;
        case "Dec":
          month = 12;
          break;
        // In case of ERROR
        default:
          month = 13;
      }
  dateOutString = year + "-" + month + "-" + day + " " + time;

  this.setState({endTime: dateOutString});
  this.hideEndDateTimePicker();
};

renderStartTime()
{
    if(this.state.startTime == '')
    {
      return("Start Time");
    }
    else
    {
      return(this.state.startTime.toString());
    } 
}

renderEndTime()
{
    if(this.state.endTime == '')
    {
      return("End Time");
    }
    else
    {
      return(this.state.endTime.toString());
    } 
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
                      onPress={ this.showStartDateTimePicker }>
                    <Text style={styles.datebuttonText}>{this.renderStartTime()}
                    </Text>
                    </TouchableOpacity>   
                    <DateTimePicker 
                        mode="datetime"
                        isVisible={this.state.startDateTimePickerVisible}
                        onConfirm={this.handleStartDatePicked }
                        onCancel={this.hideStartDateTimePicker }
                    />

                    <TouchableOpacity style={styles.datebutton} 
                      onPress={ this.showEndDateTimePicker }>
                    <Text style={styles.datebuttonText}>{this.renderEndTime()}
                    </Text>
                    </TouchableOpacity> 
                    <DateTimePicker 
                        mode="datetime"
                        isVisible={this.state.endDateTimePickerVisible}
                        onConfirm={this.handleEndDatePicked }
                        onCancel={this.hideEndDateTimePicker}
                    /> 

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