import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  FlatList
} from "react-native";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";
import NavigationForm from "../components/navigationForm";
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import {ListItem } from "react-native-elements";

export default class SuggestEvent extends Component {

  constructor(props){
    super(props);
    
    this.inputRefs = {};
		this.state={
            
            token: "",
            pickedDate: "",
            datePickerVisible: false,
            duration: 0,
            weekDay:"",
            suggestions:{},
            suggestionDisplay: false,
            suggestionDuration: 0,
            loading: false,
            refreshing: false,
            startTime: "",
            endTime: "",
            datePicked: false,
            date: "",
            items: [
                {
                    label: ' 30 minutes',
                    value:    0.5,
                },
                {
                    label: ' 1 hour',
                    value:      1,
                },
                {
                    label: ' 1 hour 30 minutes',
                    value:    1.5,
                },
                {
                    label: ' 2 Hours',
                    value:      2,
                },
                {
                    label: ' 2 Hours 30 minutes',
                    value:    2.5,
                },
                {
                    label: ' 3 Hours',
                    value:      3,
                },
                {
                    label: ' 3 Hours 30 minutes',
                    value:    3.5,
                },
                {
                    label: ' 4 Hours',
                    value:      4,
                },
                {
                    label: ' 4 Hours 30 minutes',
                    value:    4.5,
                },
                {
                    label: ' 5 Hours',
                    value:      5,
                },
                {
                  label: ' 5 Hours 30 minutes',
                  value:    5.5,
              },
              {
                  label: ' 6 Hours',
                  value:      6,
              },
              {
                  label: ' 6 Hours 30 minutes',
                  value:    6.5,
              },
              {
                  label: ' 7 Hours',
                  value:      7,
              },
              {
                  label: ' 7 Hours 30 minutes',
                  value:    7.5,
              },
              {
                  label: ' 8 Hours',
                  value:      8,
              },
            ],
    };

    //retrieve token from AsyncStorage
    AsyncStorage.getItem("token").then((value) => {
          this.setState({token: value});
      }).done();

  }

  async saveStartTime(value) {
    try {
      await AsyncStorage.setItem("startTime", value);
    } catch (error) {
      //console.log("Error saving data" + error);
    }
  }

  async saveEndTime(value) {
    try {
      await AsyncStorage.setItem("endTime", value);
    } catch (error) {
      //console.log("Error saving data" + error);
    }
  }

  //Call addEvent API, send groupId, eventName, description
  //pickedDate and endTime as key value pair in the post API 
  //call and allow user to sign up a new account
  addEvent = () => {
    const {token, pickedDate, groupId, duration, weekDay} = this.state;

    if(pickedDate == "")
    {
      Toast.show("Please input a date for your event.", Toast.LONG);
    }
    else if(duration == 0)
    {
      Toast.show("Please input a duration for your event.", Toast.LONG);
    }
    else
    {
      fetch("http://104.42.79.90:2990/group/getAvailabilities?groupId=" + this.props.groupID,{
        
			      method:"post",
			      headers:{
				              "Accept": "application/json",
                              "Content-type": "application/json",
                              "Authorization": "Bearer " + token,
                  },
                  body:JSON.stringify({
                    date: pickedDate,
                    day: weekDay,
                    timeThreshold: duration,
          })				
		      })
		      .then((response) => response.json())
		      .then((responseJson) => {

                    this.setState({
                      suggestions: responseJson,
                      suggestionDisplay: true,
                      suggestionDuration: duration,
                    });	
          });
    }
    Keyboard.dismiss();
}

showStartDateTimePicker  = () => this.setState({ datePickerVisible: true });

hideDatePicker  = () => this.setState({ datePickerVisible: false });

// Interpret start date
handleDatePicked  = (date) => {
  var dateString = date.toString();
  // E.G: dateString = Sun Oct 21 2018 17:38:00 GMT-700 (PDT)
  var dateStringArray = dateString.split(" ",5);
  var day = dateStringArray[2];
  var month;
  var year = dateStringArray[3];
  var dateOutString;
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
  dateOutString = year + "-" + month + "-" + day;
  this.setState({
      pickedDate: dateOutString,
      weekDay: dateStringArray[0],
    });
  this.hideDatePicker();
};

// Take a numeric value for time - i.e. 1.5 and convert to a timeString - 01:30:00
timeToString(time) {
  var timeString
  if(time < 10) {
    timeString = "0" + time.toString();
  } else {
    timeString = time.toString();
  }
  
  if(!timeString.includes(".")) {
    return timeString + ":00:00";
  } else {
    //remove the ".5" from timeString
    timeString = timeString.slice(0,-2);
    return timeString + ":30:00";
  }
}

// Set state variables "selectedStartTime" and "selectedEndTime" based on start time chosen and duration
setStartTime(startTime, duration)
{
    var myStartTime = this.timeToString(startTime);
    return myStartTime;
}

setEndTime(startTime, duration)
{
    var endTime = parseFloat(startTime) + parseFloat(duration);
    var myEndTime = this.timeToString(endTime);
    return myEndTime;
}

//if user has input a start time, then use the user input to 
//display, otherwise, display "Start Time"
renderTime()
{
    if(this.state.pickedDate === "")
    {
      return("Choose a date for event");
    }
    else
    {
      return(this.state.pickedDate.toString());
    } 
}

renderSeparator = () => {
  return (
    <View style={styles.renderSeparator}/>
  );
};

// Display loading icon
renderFooter = () => {
  if (!this.state.loading) {
      return null;
  }

  return (
    <View style={styles.renderFooter}>
      <ActivityIndicator animating size="large" />
    </View>
  );
};

// Display empty group list text
renderEmptyList = () => {
  if (this.state.loading) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>No time suggestion found. Try to
            change the date or duration!</Text>
    </View>
  );
};

renderRightIcon(eventStartTime, eventEndTime){
    return(
      <TouchableOpacity style={styles.addbutton} 
      onPress={() => {  
                      Actions.createevent({startTime: this.state.pickedDate + " " + eventStartTime, 
                                            endTime: this.state.pickedDate + " " + eventEndTime,
                                            groupID: this.props.groupID})
                  }}>
      <Text style={styles.buttonText}>Add
      </Text>
    </TouchableOpacity>   
    ); 
}

renderSuggestions()
{
  if(this.state.suggestionDisplay == true)
  {
    return(
      <FlatList
      data={this.state.suggestions.freeTimes}
      renderItem={({ item }) => (
        <ListItem 
          containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
          roundAvatar
          titleStyle={styles.titleText}
          title={this.setStartTime(item.timeSlot, this.state.suggestionDuration).substring(0, 5) + " - " + 
                  this.setEndTime(item.timeSlot, this.state.suggestionDuration).substring(0, 5)}
          subtitleStyle={styles.subtitleText}
          subtitle={item.numUsersAvailable + "/" + this.state.suggestions.numUsersInGroup + " people are free"}
          rightIcon={this.renderRightIcon(this.setStartTime(item.timeSlot, this.state.suggestionDuration), 
            this.setEndTime(item.timeSlot, this.state.suggestionDuration))}
          >
        </ListItem>
      )}
      keyExtractor={(item) => item.timeSlot}
      ItemSeparatorComponent={this.renderSeparator}
      ListFooterComponent={this.renderFooter}
      ListEmptyComponent={this.renderEmptyList}
      refreshing={this.state.refreshing}
      onEndReached={this.handleLoadMore}
      onEndReachedThreshold={50}
    />   
    );
  }
}

	render(){
		return(
      <View style={{flex: 1, backgroundColor: "#455a64"}}>
      <NavigationForm title="Find an Event Time" type="suggestEvent"></NavigationForm>
      <ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.container}>
                    
                    <TouchableOpacity style={styles.datebutton} 
                      onPress={ this.showStartDateTimePicker }>
                    <Text style={styles.datebuttonText}>{this.renderTime()}
                    </Text>
                    </TouchableOpacity>   
                    <DateTimePicker 
                        mode="date"
                        isVisible={this.state.datePickerVisible}
                        onConfirm={this.handleDatePicked }
                        onCancel={this.hideDatePicker }
                    />

                <View style={{ paddingVertical: 5 }} />
                <RNPickerSelect
                    placeholder={{
                        label: 'Event Length',
                        value: 0,
                    }}
                    items={this.state.items}
                    onValueChange={(value) => {
                        this.setState({
                          duration: value,
                        });
                    }}
                    onUpArrow={() => {
                        this.inputRefs.name.focus();
                    }}
                    onDownArrow={() => {
                        this.inputRefs.picker2.togglePicker();
                    }}
                    style={styles.input}
                    value={this.state.duration}
                    ref={(el) => {
                        this.inputRefs.picker = el;
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={this.addEvent}>
                    <Text style={styles.buttonText}>{"Get Recommended Event Time"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} 
                    onPress={() => {Actions.createevent({groupID: this.props.groupID,
                                                          startTime: "", 
                                                          endTime: "", })}}>
                    <Text style={styles.buttonText}>{"Manually Set Event Time"}</Text>
                </TouchableOpacity> 

                 

                <Text>{"\n"}</Text>

  		</View>
      {this.renderSuggestions()} 
      </ScrollView>
      </View>
			);
	}
}

// Styles definition
const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    alignItems:"center",
    justifyContent :"center"
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
  },

  datebutton: {
    width:300,
    backgroundColor:"rgba(255, 255,255,0.2)",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    paddingHorizontal:16,
  },
  datebuttonText: {
    fontSize:16,
    color:"#ffffff",
    textAlign:"left"
  },

  input: {
    fontSize: 30,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'white',
},

iconClose: {
  marginRight: 10,
  fontSize: 24,
  height: 22,
  color: "#CB3333",
},

renderFooter:
{
  paddingVertical: 20,
  borderTopWidth: 1,
  borderColor: "#455a64",
},

renderSeparator:
{
  height: 1,
  width: "95%",
  backgroundColor: "grey",
  marginLeft: "2.5%",
},

Text: {
  fontSize:16,
  fontWeight:"500",
  color:"#ffffff",
  textAlign:"center",
},
titleText: {
  color:"#ffffff",
  fontWeight: "300",
  fontSize:16
},
subtitleText: {
  color:"#ced0ce",
  fontSize:14,
  fontWeight: "100"
},

addbutton: {
  width:50,
  height:36,
  textAlign:"center",
  backgroundColor:"#1c313a",
  borderRadius: 25,
  paddingVertical: 6
},
  
});