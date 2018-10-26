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

    console.log("token in getEvents:  " + token);
    var userevents = await fetch("http://104.42.79.90:2990/group/getEvents", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
            "groupId": groupId,
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
    console.log("events.length:  " + events.length);
    console.log("events:  " + events.toString);

  // var array=[];
  // events[] format in APIdocumentation.txt

  //   for (var i in events) {
  //     events[i].forEach(function(elem, index) {
  //         console.log(elem, index);
  //     });
  // }
  }

  //Get current date
  getDate()
  {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    var curDate = year + "-" + month + "-" + date;
    console.log("curDate:  " + curDate);

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

    groupId = this.props.groupID;

    console.log("token in getGroupInfo:  " + usertoken);
    console.log("groupId:  " + groupId);

    var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
            "groupId": groupId, 
          }
        });

    const groupinfojson = await groupInfos.json();
    
    console.log("current user id:  " + curuserid);
    console.log("group owner id:  " + groupinfojson.groupInfo.leaderId);
    
    this.setState({
      groupinfo: groupinfojson.groupInfo,
      userid: curuserid,
      groupID: groupId,
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
  //             name: "Item for " + strTime,
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

  // renderItem(item) {
  //   return (
  //     <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
  //   );
  // }

  // renderEmptyDate() {
  //   return (
  //     <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
  //   );
  // }

  // rowHasChanged(r1, r2) {
  //   return r1.name !== r2.name;
  // }

  // timeToString(time) {
  //   const date = new Date(time);
  //   return date.toISOString().split("T")[0];
  // }

	render(){
    const { events, token, userid, groupinfo, groupID, curDate} = this.state;

    // const event1 = {key:"CPEN 321 MVP", color: "red"};
    // const event2 = {key:"ELEC 221 Lecture", color: "blue"};
    // const event3 = {key:"CPEN 321 Lecture", color: "green"};
    // const event4 = {key:"ELEC 221 Quiz", color: "red"};
    // const event5 = {key:"CPEN 311 Midterm", color: "blue"};

      return(
        <View style={{flex: 1}}>
        <NavigationForm type="groupprofile" title={this.props.groupName}
          groupID={this.props.groupID}></NavigationForm>
          {/* <Agenda
              items={this.state.items}
              loadItemsForMonth={this.loadItems.bind(this)}
              selected={curDate}
              renderItem={this.renderItem.bind(this)}
              renderEmptyDate={this.renderEmptyDate.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
              markingType={"multi-dot"}
              markedDates={{
                "2018-10-22": {dots: [event1, event2, event3]},
                "2018-10-23": {dots: [event4, event5]},
              }}
              monthFormat={"yyyy"}
              theme={{calendarBackground: "#758d9f", agendaKnobColor: "#679fad"}}
              renderDay={(day, item) => (<Text>{day ? day.day: "item"}</Text>)}
          /> */}
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