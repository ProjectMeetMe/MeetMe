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
import Dialog, {
  DialogTitle,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';
import {YellowBox} from 'react-native';

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
        customBackgroundDialog: false,
        editDialog: false,
        curDescription: "",
        newDescription: "",
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    YellowBox.ignoreWarnings(['Warning: Failed prop type: Prop']);

    this.getDate();
    this.getGroupInfo();
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
    const { events, token} = this.state;
    const usertoken = await AsyncStorage.getItem("token");
    const curuserid = await AsyncStorage.getItem("userid");

    var groupId = this.props.groupID;

    var userevents = await fetch("http://104.42.79.90:2990/group/getEvents?groupId=" + groupId, {
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
      userid: curuserid,
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
    });
  }

  
  async updateEventDescription()
  {
    console.log("eventId:  " + this.state.deleteEventId );
    const usertoken = await AsyncStorage.getItem("token");
  
    var eventUpdate = await fetch("http://104.42.79.90:2990/event/editEvent?eventId=" + this.state.deleteEventId, {
          method: "put",
          headers:{
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + usertoken,
          },
          body:JSON.stringify
          ({
            description: this.state.newDescription 
          })
        });

    const eventUpdateJson = await eventUpdate.json();
    Toast.show(eventUpdateJson.message, Toast.LONG);

   

    this.handleRefresh();
  }

  async deleteGroupEvent()
  {
    console.log("eventId:  " + this.state.deleteEventId );
    const usertoken = await AsyncStorage.getItem("token");

    var eventRemove = await fetch("http://104.42.79.90:2990/event/deleteEvent?eventId=" + this.state.deleteEventId, {
          method: "delete",
          headers:{
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + usertoken,
          },
        });

    const eventRemoveJson = await eventRemove.json();
    Toast.show(eventRemoveJson.message, Toast.LONG);

    this.handleRefresh();
  }

  wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        //this.wait(300);
        this.getDate();
        this.getEvents();
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
          { this.renderPopupDialog() }
          { this.renderEditDialog() }
          
          {/* <ActionButton buttonColor="rgba(231,76,60,1)">
              <ActionButton.Item buttonColor="#9b59b6" title="Group Chat" 
                textStyle = {styles.itemStyle}
                textContainerStyle = {styles.itemStyle}
                onPress={() => {Toast.show("Group Chat");
                }}>
                {<Icon name="message1" style={styles.actionButtonIcon} />}
              </ActionButton.Item> */}
              { this.renderCreateEvent() }
          {/* </ActionButton> */}
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
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor="#3498db" title="Create Event"
          textStyle = {styles.itemStyle} 
          textContainerStyle = {styles.itemStyle}
          onPress={() => {Actions.suggestevent({groupID: this.props.groupID});
          }}>
          <Icon name="pluscircleo" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        </ActionButton>
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
    renderPopupDialog(){
      // console.log("this.state.groupinfo.leaderId: " + this.state.groupinfo.leaderId);
      // console.log("this.state.userid: " + this.state.userid);
      if(this.state.userid == this.state.groupinfo.leaderId)
      {  
        return(
          <Dialog
            //dialogStyle={styles.dialogStyle}
            onDismiss={() => {
              this.setState({ customBackgroundDialog: false });
            }}
            onTouchOutside={() => {
              this.setState({ customBackgroundDialog: false });
            }}
            width={0.75}
            rounded={false}
            visible={this.state.customBackgroundDialog}
            dialogTitle={
              <DialogTitle
                title={"Delete event " + this.state.deleteEventName + " from this group?"}
                textStyle={styles.dialogTitle}
                hasTitleBar={this.state.customBackgroundDialog}
                align="center"
              />
            }
            actions={[
              <DialogButton
                text="CANCEL"
                onPress={() => {
                  this.setState({ customBackgroundDialog: false });
                }}
                key="cancel"
                style={styles.dialogButton}
                textStyle={styles.cancelButtonText}
              />,
              <DialogButton
                text="DELETE"
                onPress={() => {
                  this.deleteGroupEvent();
                  this.setState({ customBackgroundDialog: false });
                }}
                key="delete"
                style={styles.dialogButton}
                textStyle={styles.deleteButtonText}
              />,
            ]}
          >
          </Dialog>
        );   
      }    
      }

      renderEditDialog() {
          return(
            <Dialog
              //dialogStyle={styles.dialogStyle}
              onDismiss={() => {
                this.setState({ editDialog: false });
              }}
              onTouchOutside={() => {
                this.setState({ editDialog: false });
              }}
              rounded={false}
              width={0.9}
              visible={this.state.editDialog}
              dialogTitle={
                <DialogTitle
                  title={"Update Event Notes"}
                  textStyle={styles.dialogTitle}
                  hasTitleBar={this.state.editDialog}
                  align="center"
                />
              }
              actions={[
                <DialogButton
                  text="CANCEL"
                  onPress={() => {
                    this.setState({ editDialog: false });
                  }}
                  key="cancel"
                  style={styles.dialogButton}
                  textStyle={styles.cancelButtonText}
                />,
                <DialogButton
                  text="SAVE"
                  onPress={() => {
                    //INSERT API CALL TO UPDATE EVENT DESCRIPTION HERE
                    this.updateEventDescription();
                    this.setState({ editDialog: false });
                  }}
                  key="save"
                  style={styles.dialogButton}
                  textStyle={styles.deleteButtonText}
                />,
              ]}
            >
            <DialogContent>
              {
                <TextInput style={styles.longInputBox} 
                multiline={true}
                textAlignVertical={"top"}
                underlineColorAndroid="rgba(0,0,0,0)" 
                defaultValue={this.state.curDescription}
                selectionColor="#000000"
                keyboardType="email-address"
                onChangeText={(newDescription) => this.setState({newDescription})}
            />
              }
            </DialogContent>
            </Dialog>
          );   
        }    

    renderItem(item) {
      if(this.state.userid == this.state.groupinfo.leaderId)
      {
        return (
          <View style={[styles.item]}>
              <View>
                  <View style={{flexDirection: 'row'}}>
                        <Text>{item.startTime.substring(11, 16) + " - " + item.endTime.substring(11, 16)}</Text>
                        <Icon name="close" style={styles.iconClose}                
                          onPress={() => {
                            //Toast.show("clicked");
                                this.setState({
                                  customBackgroundDialog: true,
                                  deleteEventId: item.id,
                                  deleteEventName: item.eventName,
                              })
                              console.log("after clicked: ", this.state.customBackgroundDialog);
                          }}/>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => {
                      this.setState({ 
                        editDialog: true, 
                        // We use deleteEventId for convenience. Name of variable does not matter
                        deleteEventId: item.id, 
                        curDescription: item.description,
                      })
                    }}>	
						          <Text style={styles.eventNameText}>{item.eventName}</Text>
				          	</TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => {
                      this.setState({ 
                        editDialog: true, 
                        // We use deleteEventId for convenience. Name of variable does not matter
                        deleteEventId: item.id, 
                        curDescription: item.description
                      })
                    }}>	
						          <Text>{item.description}</Text>
				          	</TouchableOpacity>
                  </View>
              </View>
            </View>
        );
      }
      else
      {
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
    }
  
    renderEmptyDate() {
      return (
        <View style={[styles.emptyDate]}>
          <View>
              <View><Text style={styles.emptyDateText}>
                    {"There are no events today"}
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

  longInputBox: {
    minHeight: 100,
    width:290,
    backgroundColor:"rgb(240,240,240)",
    borderRadius: 0,
    paddingHorizontal:10,
    fontSize:16,
    color:"#000000",
    marginVertical: 10
},

descriptionText: {
  fontSize:16,
  color:"#ffffff",
  textAlign:"left"
},
eventNameText: {
  fontWeight: "bold",
}, 
  
});