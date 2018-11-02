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
        refreshing: false,
        //Events from the database - JSON object
        items: {},
        dotEvents: {},
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    this.getDate();
    this.getEvents();
    this.getDotEvents();
    this.getGroupInfo();

    this.setState({
      loading: false,
      refreshing: false,
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
      refreshing: false,
    });
  }

  // TODO: get events[] from database then convert them into item{} format
  // TODO: located in https://github.com/wix/react-native-calendars?fbclid=IwAR3bGgMcHXC-eHFBtAtswAbjSrMgoASfbCNtItRRDBVmkiHr_8Gcyxi6ePM#readme
  // The events[] format is in APIdocumentation.txt
  async getDotEvents()
  {
    const { events, refreshing } = this.state;

  this.setState({
    items:   {
      '2018-10-30': [{eventName: 'Work on App', eventStartTime: '12:00', eventEndTime: '14:00', eventDescription: 'We have to work on this fucking app today :('},
                     {eventName: 'Work on ELEC221', eventStartTime: '15:00', eventEndTime: '16:00', eventDescription: 'I dont like this class mom :('},
                     {eventName: 'Dinner with girlfriend', eventStartTime: '18:00', eventEndTime: '19:00', eventDescription: 'Its gonna be tough'}],
      '2018-10-31': [{eventName: 'Get out from bed', eventStartTime: '12:00', eventEndTime: '14:00', eventDescription: 'Why did it took me 2 hours to get out of my bed? :('},
                     {eventName: 'Wondering', eventStartTime: '17:00', eventEndTime: '17:30', eventDescription: 'Am I even going to school today?'},
                     {eventName: 'No wondering', eventStartTime: '18:00', eventEndTime: '18:30', eventDescription: 'Nah XD'}],
      '2018-11-01': [{eventName: 'Hello everyone', eventStartTime: '08:00', eventEndTime: '09:00', eventDescription: 'What am I doing'},
                     {eventName: 'I am confused', eventStartTime: '12:00', eventEndTime: '22:30', eventDescription: 'Day dreaming'},],
      '2018-11-02': [{eventName: 'Hahahahaha', eventStartTime: '10:00', eventEndTime: '14:00', eventDescription: 'I am finally insane'},
                     {eventName: 'Hahahahahhahahah', eventStartTime: '15:00', eventEndTime: '17:30', eventDescription: 'Hahahahahahahahhahahahahahahahahahahahhahah, hahahahahahahhahahahahahahhahahaha, hahahahahahhahahahahhahaha'},
                     {eventName: 'Lets roll', eventStartTime: '18:00', eventEndTime: '18:30', eventDescription: 'What is roll?'}],
  },

    dotEvents:  {
      "2018-10-30": {dots: [{color: "red"}, {color: "blue"}, {color: "green"}]},
      "2018-10-31": {dots: [{color: "red"}, {color: "blue"}, {color: "green"}]},
      "2018-11-01": {dots: [{color: "red"}, {color: "blue"} ]},
      "2018-11-02": {dots: [{color: "red"}, {color: "blue"}, {color: "green"}]},
  },
      //refreshing: false,
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

  async deleteGroupEvent()
  {
    const usertoken = await AsyncStorage.getItem("token");
    var groupId = this.props.groupID;

    console.log("this.state.deleteUserId: =============" + this.state.deleteUserId);

    var memberRemove = await fetch("http://104.42.79.90:2990/event/deleteEvent?groupId=" + groupId, {
          method: "put",
          headers:{
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + usertoken,
          },
          body:JSON.stringify({
            userId: this.state.deleteUserId,
          })
        });

    const memberRemoveJson = await memberRemove.json();
    Toast.show(memberRemoveJson.message, Toast.LONG);
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getDate();
        this.getEvents();
        this.getItems();
      }
    );
  };

	render(){
    const { events, token, userid, groupinfo, groupID, curDate} = this.state;

    // if(this.state.loading == true) {
		// 	return <View style={styles.container}>
		// 			<Text style={styles.Text}>Loading...</Text>
		// 			</View>;
    // }
      return(
        <View style={{flex: 1}}>
        <NavigationForm type="groupprofile" title={this.props.groupName}
          groupID={this.props.groupID}></NavigationForm>
          <Agenda
            items={this.state.items}
            // callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={this.loadItems.bind(this)}
            //onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
            //renderEmptyData={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
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
          const newItems = {};
          Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
          this.setState({
            items: newItems
          });
        }, 1000);
    }
  
    // loadItems(day) {
    //   setTimeout(() => {
    //       const newItems = {};

    //       time = day.timestamp;
    //       const strTime = this.timeToString(time);

    //       if(!this.state.items[strTime])
    //       {
    //         this.state.items[strTime].push({
    //           eventStartTime: "No event found at that day for group " + this.props.groupName,
    //           height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //         Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
    //         this.setState({
    //           items: newItems
    //         });
    //       }
    //       else
    //       {
    //         Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    //         this.setState({
    //           items: newItems
    //         });
    //       }
    //     }, 1000);
    // }

    // loadItems(day) {
    //   setTimeout(() => {
    //     for (let i = -15; i < 85; i++) {
    //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //       const strTime = this.timeToString(time);
    //       if (!this.state.items[strTime]) {
    //         this.state.items[strTime] = [];
    //         const numItems = Math.floor(Math.random() * 5);
    //         for (let j = 0; j < numItems; j++) {
    //           this.state.items[strTime].push({
    //             eventStartTime: 'Item for ' + strTime,
    //             height: Math.max(50, Math.floor(Math.random() * 150))
    //           });
    //         }
    //       }
    //     }
    //     //console.log(this.state.items);
    //     const newItems = {};
    //     Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    //     this.setState({
    //       items: newItems
    //     });
    //   }, 1000);
    //   // console.log(`Load Items for ${day.year}-${day.month}`);
    // }

    renderItem(item) {
      if(this.state.userid == this.state.groupinfo.leaderId)
      {
        return (
          <View style={[styles.item]}>
              <View>
                  <View style={{flexDirection: 'row'}}><Text>{item.eventStartTime + " - " + item.eventEndTime}</Text>
                        <Icon name="close" style={styles.iconClose}                
                          onPress={() => {
                            Toast.show("clicked remove icon");
                              //   this.setState({
                              //     customBackgroundDialog: true,
                              // }
                          }}/>
                  </View>
                  <View><Text>{item.eventName}</Text></View>
                  <View><Text>{item.eventDescription}</Text></View>
              </View>
            </View>
        );
      }
      else
      {
        return (
          <View style={[styles.item]}>
              <View>
                  <View><Text>{item.eventStartTime + " - " + item.eventEndTime}</Text></View>
                  <View><Text>{item.eventName}</Text></View>
                  <View><Text>{item.eventDescription}</Text></View>
              </View>
            </View>
        );
      }
    }
  
    renderEmptyDate() {
      return (
        <View style={[styles.emptyDate]}>
          <View>
              <View><Text style={styles.emptyDateText}>
                    {"No event found at that day for group " + this.props.groupName}
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
  
});