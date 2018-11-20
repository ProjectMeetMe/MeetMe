import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard 
} from "react-native";
import Toast from "react-native-simple-toast";
import {Actions} from "react-native-router-flux";
import NavigationForm from "../components/navigationForm";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/AntDesign";
import {YellowBox} from 'react-native';

export default class UserCalendar extends Component {

  constructor(props){
		super(props);
		this.state={
            
        //Data from the database
        events:[],
        token: "",
        userid: "",
        curDate: "",
        loading: true,
        refreshing: false,
        //Events from the database - JSON object
        items: {},
        dotEvents: {},
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    YellowBox.ignoreWarnings(['Warning: Failed prop type: Prop']);

    this.getDate();
    this.getEvents();

    this.setState({
      loading: false,
      refreshing: false,
    });
  }
  
  //Call getEvents API, add groupId to URL 
  //call and allow user to get all events in this group
  async getEvents()
  {
    const usertoken = await AsyncStorage.getItem("token");

    console.log("usertoken:   " + usertoken);

    var userevents = await fetch("http://104.42.79.90:2990/user/getEvents", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });

    const userevent = await userevents.json();

    // console.log(userevents.events);
    // console.log(userevent.events);
    //store events array
    this.setState({
      items: userevent.events.categorizedEvents,
      dotEvents: userevent.events.dotEvents,
      refreshing: false,
      token: this.usertoken,
    });
  }

  //Get current date
  getDate()
  {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    var curDate = year + "-" + month + "-" + date;

    this.setState({
      curDate: curDate,
    });
  }


	render(){
    const { events, token, userid, groupinfo, groupID, curDate} = this.state;

      return(
        <View style={{flex: 1}}>
        <NavigationForm type="myschedule" title="My Schedule"></NavigationForm>
          <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems.bind(this)}
            selected={curDate}
            minDate={'2018-09-01'}
            maxDate={'2019-04-30'}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate = {this.renderEmptyDate.bind(this)}
            onDayPress={this.onDayPress}
            onDayChange={this.onDayChange}
            rowHasChanged={this.rowHasChanged.bind(this)}
            markingType={"multi-dot"}
            markedDates={this.state.dotEvents}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            refreshControl={null}
            theme={{
              agendaDayTextColor: '#3390FF',
              agendaDayNumColor: '#3390FF',
              agendaTodayColor: '#3390FF',
              agendaKnobColor: '#4A4B4A'
            }}
            style={{}}
          />
        </View> 
      );
    }

    onDayPress = (date) => {
      this.setState({
        date: new Date(date.year, date.month-1, date.day),
      });
    };
  
    onDayChange = (date) => {
      this.setState({
        date: new Date(date.year, date.month-1, date.day),
      });
    };
  
    loadItems(day) {
      setTimeout(() => {
          const newItems = {};
          Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
          this.setState({
            items: newItems
          });
        }, 1000);
    }

    renderItem(item) {
        return (
          <View style={[styles.item]}>
              <View>
                  <View><Text>{item.startTime.substring(11, 16) + " - " + item.endTime.substring(11, 16)}</Text></View>
                  <View><Text>{item.eventName}</Text></View>
                  <View><Text>{item.description}</Text></View>
              </View>
            </View>
        );
    }
  
    renderEmptyDate() {
      return (
        <View style={[styles.emptyDate]}>
          <View>
              <View><Text style={styles.emptyDateText}>
                    {"No event found at that day for you"}
              </Text></View>
          </View>
        </View>
      );
    }
  
    rowHasChanged(r1, r2) {
      return r1.eventStartTime !== r2.eventStartTime || r1.eventEndTime !== r2.eventEndTime ||
             r1.eventName !== r2.eventName || r1.eventDescription !== r2.eventDescription;
    }
  
    timeToString(time) {
      const date = new Date(time);
      return date.toISOString().split("T")[0];
    }
}



const styles = StyleSheet.create({

  inputBox: {
    width:300,
    backgroundColor:"rgba(255, 255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:"#ffffff",
    marginVertical: 10
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "#1c313a",
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

  container : {
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"#455a64",
    flexDirection: "row",
  },

  Text: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },

  emptyDateText: {
    // fontSize:16,
    // fontWeight:"200",
    // color:"#1c313a",
    textAlign:"center"
  },

  itemStyle: {
    backgroundColor: "#1c313a",
    color: "#ffffff"
  },  
  
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    marginTop: 45,
    marginRight: 10,
    // borderTopWidth: 2,
    // borderTopColor: '#dddddd',
    height: 5,
  },

  iconClose: {
    //marginRight: 10,
    marginLeft: 168,
    fontSize: 18,
    height: 22,
    color: "#CB3333",
    textAlign: 'right',
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