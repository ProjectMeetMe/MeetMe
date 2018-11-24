import React, { Component } from "react";
import { AsyncStorage, AppRegistry,View,Text,StyleSheet,
    FlatList, ActivityIndicator, ScrollView } from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import {List, ListItem, SearchBar } from "react-native-elements";
import Toast from "react-native-simple-toast";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/AntDesign";
import {Actions} from "react-native-router-flux";
import {YellowBox} from "react-native";
import _ from "lodash";
import BackgroundTask from 'react-native-background-task'
import Pusher from 'pusher-js/react-native';
export default class Home extends Component{
  
  constructor() {

    super();

    this.state = {
      token: "",
      groups: [],
      refreshing: false,
      loading: true,
      query: "",
    };
}

  componentDidMount() {
    BackgroundTask.schedule();
    this.checkStatus();
    this.getGroups();
    this.timer = setInterval(()=> this.refreshUserData(), 30000);

    // Pusher.logToConsole = true;
    // var pusher = new Pusher('acd79456b6d0660329b3',{
    //   cluster:  'mt1',
    //   forceTLS: true
    // });

    // var channel = pusher.subscribe("1");
    // channel.bind('testEvent', function(data)
    // {
    //   alert(data.message)
    // });
  }

  async checkStatus() {
    const status = await BackgroundTask.statusAsync();
    console.log("status.available:      " + status.available);
  }

  async refreshUserData(){

    console.log("Periocally get calls start:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    const usertoken = await AsyncStorage.getItem("token");

    console.log("usertoken:   " + usertoken);

    var userevents = await fetch("http://104.42.79.90:2990/user/getEvents", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });
    const userevent = await userevents.json();

    await AsyncStorage.setItem("useritems", JSON.stringify(userevent.events.categorizedEvents)); 
    await AsyncStorage.setItem("userdotEvents", JSON.stringify(userevent.events.dotEvents));
   
    console.log("Periocally get calls end:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
   }
  
  //Redirect page to creategroup view
  creategroup() {
		Actions.creategroup();
  }

  //Redirect page to joingroup view
  joingroup() {
		Actions.joingroup();
  }

  //Redirect page to groupprofile view
  groupprofile() {
		Actions.groupprofile();
  }

  //Call getGroups API, get all the groups the user has 
  //joined
  async getGroups()
  {
    const { groups, token, loading, refreshing } = this.state;
    const usertoken = await AsyncStorage.getItem("token");

    console.log("usertoken:  " + usertoken);
    YellowBox.ignoreWarnings(['Warning: Each child in an array or iterator should have a unique']);

    var usergroups = await fetch("http://104.42.79.90:2990/user/getGroups", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken
          }
        });

    const usergroup = await usergroups.json();

    this.setState({
      token: usertoken,
      groups: usergroup.groups,
      loading: false,
      refreshing: false,
    });
  }

  // Pull-down refresh
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getGroups();
      }
    );
  };

  // TODO: Implement searchbar functionality
  
 
  handleSearch = (text) => {
    this.setState({ query: text });
  };
  

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
        <Text style={styles.Text}>You do not have any groups yet.{"\n"}
            You can create a group or join a group.</Text>
      </View>
    );
  };

	render(){

    const { groups, token } = this.state;

      return(
        <View style={{flex: 1, backgroundColor: "#455a64"}}>          
          <NavigationForm title="My Groups" type="home"></NavigationForm>
          <FlatList
            data={this.state.groups}
            renderItem={({ item }) => (
              <ListItem 
                containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
                roundAvatar
                titleStyle={styles.titleText}
                title={item.groupName}
                subtitleStyle={styles.subtitleText}
                subtitle={"Group ID: " + item.id}
                onPress={() => {Actions.groupprofile({groupID: item.id, groupName:item.groupName});
                }}>
              </ListItem>
            )}
            keyExtractor={(item) => item.groupName}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            ListEmptyComponent={this.renderEmptyList}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor="#9b59b6" title="Create Group" 
              textStyle = {styles.itemStyle}
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Actions.creategroup();}}>
              {<Icon name="pluscircleo" style={styles.actionButtonIcon} />}
            </ActionButton.Item>
            <ActionButton.Item buttonColor="#3498db" title="Join Group"
              textStyle = {styles.itemStyle} 
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Actions.joingroup();}}>
              <Icon name="pluscircle" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View> 
      );
    
	}
}

BackgroundTask.define(
  async () => {
    console.log('Background task start:   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');

    const usertoken = await AsyncStorage.getItem("token");

    console.log("usertoken:   " + usertoken);

    var userevents = await fetch("http://104.42.79.90:2990/user/getEvents", {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });
    const userevent = await userevents.json();

    await AsyncStorage.setItem("useritems", JSON.stringify(userevent.events.categorizedEvents)); 
    await AsyncStorage.setItem("userdotEvents", JSON.stringify(userevent.events.dotEvents)); 

    console.log('Background task Finish:   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

    BackgroundTask.finish()
  },
)

// Style definitions
const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"#455a64",
    flexDirection: "row",
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "#1c313a",
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

  button: {
    width:300,
    backgroundColor:"#1c313a",
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
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
  	fontSize:18
  },
  subtitleText: {
  	color:"#ced0ce",
    fontSize:14,
    fontWeight: "100"
  },

scene: {
    flex: 1,
    paddingTop: 25,
},
user: {
    width: "100%",
    backgroundColor: "#333",
    marginBottom: 10,
    paddingLeft: 25,
},
userName: {
    fontSize: 17,
    paddingVertical: 20,
    color: "#fff"
},

itemStyle: {
  backgroundColor: "#1c313a",
  color: "#ffffff"
}
});
