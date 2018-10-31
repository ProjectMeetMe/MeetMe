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

export default class GroupProfile extends Component {

  constructor(props){
		super(props);
		this.state={
            
        //Data from the database
        events:[],
        token: "",
        userid: "",
        groupinfo: "",
        groupID: 0,
        curDate: "",
        loading: true,
        //Events from the database - JSON object
        items: {},
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    this.getDate();
    this.getEvents();
    this.getItems();
    this.getGroupInfo();

    this.setState({
			loading: false,
    });
  }
  
  //Call getEvents API, add groupId to URL 
  //call and allow user to get all events in this group
  async getEvents()
  {
    const { events, token} = this.state;
    const usertoken = await AsyncStorage.getItem("token");

    var groupId = this.props.groupID;

    this.setState({
      token: this.usertoken,
    });

    //console.log("token in getEvents:  " + token);
    var userevents = await fetch("http://104.42.79.90:2990/group/getEvents?groupId=" + groupId, {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });

    const userevent = await userevents.json();

    //store events array
    this.setState({
      events: userevent.events,
    });
  }

  // TODO: get events[] from database then convert them into item{} format
  // TODO: located in https://github.com/wix/react-native-calendars?fbclid=IwAR3bGgMcHXC-eHFBtAtswAbjSrMgoASfbCNtItRRDBVmkiHr_8Gcyxi6ePM#readme
  // The events[] format is in APIdocumentation.txt
  async getItems()
  {
    const { events } = this.state;
    //console.log("events.length:  " + events.length);
    //console.log("events:  " + events.toString);

  // var array=[];
  // events[] format in APIdocumentation.txt

  //   for (var i in events) {
  //     events[i].forEach(function(elem, index) {
  //         console.log(elem, index);
  //     });
  // }
  this.setState({
    items:   {
      '2018-10-30': [{eventName: 'Work on App', eventStartTime: '12:00:00', eventEndTime: '14:00:00', eventDescription: 'We have to work on this fucking app today :('},
                     {eventName: 'Work on ELEC221', eventStartTime: '15:00:00', eventEndTime: '16:00:00', eventDescription: 'I dont like this class mom :('},
                     {eventName: 'Dinner with girlfriend', eventStartTime: '18:00:00', eventEndTime: '19:00:00', eventDescription: 'Its gonna be tough'}],
      '2018-10-31': [{eventName: 'Get out from bed', eventStartTime: '12:00:00', eventEndTime: '14:00:00', eventDescription: 'Why did it took me 2 hours to get out of my bed? :('},
                     {eventName: 'Wondering', eventStartTime: '17:00:00', eventEndTime: '17:30:00', eventDescription: 'Am I even going to school today?'},
                     {eventName: 'No wondering', eventStartTime: '18:00:00', eventEndTime: '18:30:00', eventDescription: 'Nah XD'}],
      '2018-11-01': [{eventName: 'Hello everyone', eventStartTime: '8:00:00', eventEndTime: '9:00:00', eventDescription: 'What am I doing'},
                     {eventName: 'I am confused', eventStartTime: '12:00:00', eventEndTime: '22:30:00', eventDescription: 'Day dreaming'},],
      '2018-11-02': [{eventName: 'Hahahahaha', eventStartTime: '10:00:00', eventEndTime: '14:00:00', eventDescription: 'I am finally insane'},
                     {eventName: 'Hahahahahhahahah', eventStartTime: '15:00:00', eventEndTime: '17:30:00', eventDescription: 'Hahahahahahahahhahahahahahahahahahahahhahah, hahahahahahahhahahahahahahhahahaha, hahahahahahhahahahahhahaha'},
                     {eventName: 'Lets roll', eventStartTime: '18:00:00', eventEndTime: '18:30:00', eventDescription: 'What is roll?'}],
  },
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

  //Call getGroup API to reterive all information about this
  //group
  async getGroupInfo()
  {
    const { events, token, userid} = this.state;
    const curuserid = await AsyncStorage.getItem("userid");
    const usertoken = await AsyncStorage.getItem("token");

    var groupId = this.props.groupID;

    var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo?groupId=" + groupId, {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });

    const groupinfojson = await groupInfos.json();
    
    this.setState({
      groupinfo: groupinfojson.groupInfo,
      userid: curuserid,
      groupID: groupId,
			//loading: false,
    });
  }

  renderCreateEvent(){
    if(this.state.userid === this.state.groupinfo.leaderId)
    {
      return(
        <ActionButton.Item buttonColor="#3498db" title="Create Event"
        textStyle = {styles.itemStyle} 
        textContainerStyle = {styles.itemStyle}
        onPress={() => {Actions.createevent({groupID: this.props.groupID});
        }}>
        <Icon name="pluscircleo" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      );          
    }
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: "Item for " + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
     }, 1000);
    // // console.log(`Load Items for ${day.year}-${day.month}`);

      // setTimeout(() => {
      //   const newItems = {};
      //   Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      //   this.setState({
      //     events: newItems
      //   });
      // }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <Text>{item.eventName}{"\n"}
              {item.eventDescription}
        </Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

	render(){
    const { events, token, userid, groupinfo, groupID, curDate} = this.state;

    const event1 = {key:"CPEN 321 MVP", color: "red"};
    const event2 = {key:"ELEC 221 Lecture", color: "blue"};
    const event3 = {key:"CPEN 321 Lecture", color: "green"};
    const event4 = {key:"ELEC 221 Quiz", color: "red"};
    const event5 = {key:"CPEN 311 Midterm", color: "blue"};

    // if(this.state.loading == true) {
		// 	return <View style={styles.container}>
		// 			<Text style={styles.Text}>Loading...</Text>
		// 			</View>;
    // }
    // else
    // {
      return(
        <View style={{flex: 1}}>
        <NavigationForm type="groupprofile" title={this.props.groupName}
          groupID={this.props.groupID}></NavigationForm>
          <Agenda
            items={this.state.items}
            // callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => {console.log('trigger items loading')}}
            // callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
            // callback that gets called on day press
            onDayPress={(day)=>{console.log('day pressed')}}
            // callback that gets called when day changes while scrolling agenda list
            onDayChange={(day)=>{console.log('day changed')}}
            // initially selected day
            selected={curDate}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={'2018-01-01'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={'2018-12-31'}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // specify how each item should be rendered in agenda
            renderItem={this.renderItem.bind(this)}
            // specify how each date should be rendered. day can be undefined if the item is not first in that day.
            renderDay={(day, item) => {return (<View />);}}
            // specify how empty date content with no items should be rendered
            renderEmptyDate={() => {return (<View />);}}
            // specify how agenda knob should look like
            renderKnob={() => {return (<View />);}}
            // specify what should be rendered instead of ActivityIndicator
            renderEmptyData = {() => {return (<View />);}}
            // specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
            // Hide knob button. Default = false
            hideKnob={true}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            markingType={"multi-dot"}
            markedDates={{
              "2018-10-30": {dots: [event1, event2, event3]},
              "2018-10-31": {dots: [event4, event5]},
            }}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
            onRefresh={() => console.log('refreshing...')}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
            refreshControl={null}
            // agenda theme
            theme={{
              agendaDayTextColor: 'yellow',
              agendaDayNumColor: 'green',
              agendaTodayColor: 'red',
              agendaKnobColor: 'blue'
            }}
            // agenda container style
            style={{}}
          />
          <ActionButton buttonColor="rgba(231,76,60,1)">
              <ActionButton.Item buttonColor="#9b59b6" title="Group Chat" 
                textStyle = {styles.itemStyle}
                textContainerStyle = {styles.itemStyle}
                onPress={() => {Toast.show("Group Chat");
                }}>
                {<Icon name="message1" style={styles.actionButtonIcon} />}
              </ActionButton.Item>
              { this.renderCreateEvent() }
            </ActionButton>
        </View> 
      );
    //}
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
    height: 15,
    flex:1,
    paddingTop: 30
  }
  
});