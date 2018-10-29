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
import FetchAPI from "../controller/fetchAPI";
import {YellowBox} from 'react-native';

export default class GroupMember extends Component{
	
  constructor(props) {

    super(props);

    this.state = {
      token: "",
      members: [],
      userId: "",
      ownerId: "",
      refreshing: false,
      loading: true,
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    this.getGroupInfo();
  }

  //Call getGroup API to reterive all information about this
  //group
  async getGroupInfo()
  {
    const usertoken = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userid");

    var groupId = this.props.groupID;
    YellowBox.ignoreWarnings(['Warning: Each child in an array or iterator should have a unique']);

    // console.log("token in getGroupInfo:  " + usertoken);
    // console.log("groupId:  " + groupId);
    var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo?groupId=" + groupId, {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
            //"groupId": groupId, 
          }
        });

    const groupinfojson = await groupInfos.json();
    
    // console.log("groupInfos:  " + groupInfos);
    // console.log("groupinfojson:  " + groupinfojson.groupInfo);
    
    this.setState({
      members: groupinfojson.groupInfo.users,
      loading: false,
      refreshing: false,
      userId: userId,
      ownerId: groupinfojson.groupInfo.leaderId
    });
  }

  // Pull-down refresh
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getGroupInfo();
      }
    );
  };

  // TODO: Implement searchbar functionality
  /*
  handleSearch = (text) => {
    const formatQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, (user) => {
      return contains(user, formatQuery);
    })
    this.setState({ query: formatQuery, data});
  };
  */

  renderSeparator = () => {
    return (
      <View style={styles.renderSeparator}/>
    );
  };

  // Display searchbar
  renderHeader = () => {
    return <SearchBar 
            platform={"android"}
            clearIcon={{ color: "grey" }}
            placeholder="Search Here..." 
            inputContainerStyle={styles.container} 
            round
            />;
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
        <Text style={styles.Text}>There is nobody in this group. Try to
              add more people to your group!</Text>
      </View>
    );
  };

	render(){

      return(
        <View style={{flex: 1, backgroundColor: "#455a64"}}>          
          <NavigationForm title="Group Member" type="groupmember"></NavigationForm>
          <FlatList
            data={this.state.members}
            renderItem={({ item }) => (
              <ListItem 
                containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
                roundAvatar
                id={item.id}
                titleStyle={styles.titleText}
                title={item.firstname + " " + item.lastname}
                subtitleStyle={styles.subtitleText}
                subtitle={"Email: " + item.email}
                onPress={() => {Toast.show("Group Chat");
                }}>
              </ListItem>
            )}
            keyExtractor={(item) => {item.id}}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            //TODO: Format the text to appear in center of page
            ListEmptyComponent={this.renderEmptyList}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        </View> 
      );
    
	}
}

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