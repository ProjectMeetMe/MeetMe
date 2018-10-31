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

export default class FetchAPI extends Component{
  
  constructor() {
    super();
  }

  /*
  For this class I was thinking about to move all the api calls to this
  class to reuse more codes. It not working now and will work on that if 
  we have more time
  */
  //Call getGroup API to reterive all information about this
  //group
//   async getGroupInfo(usertoken, groupId)
//   {
//     console.log("usertoken:   " + usertoken);
//     console.log("groupId:  " + groupId);

//     var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo?groupId=" + groupId, {
//           method: "get",
//           headers:{
//             "Authorization": "Bearer " + usertoken,
//             //"groupId": groupId, 
//           }
//         });

//     const groupinfojson = await groupInfos.json();
//     console.log("group owner id:  " + groupinfojson.groupInfo.leaderId);
    
//     return groupinfojson;
//   }
}