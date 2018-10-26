import React, { Component } from "react";
import {AppRegistry, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NewGroupForm from "../components/newgroupForm";
import NavigationForm from "../components/navigationForm";

export default class CreateGroup extends Component {

  //TODO: return to homepage and refresh on return upon successful group creation
	render() {
		return(
			<View style={{flex: 1}}>
      <NavigationForm title="Create New Group" type="createGroup"></NavigationForm>
      <View style={styles.container}>
				<NewGroupForm type="Create Group"/>
			</View>	
      </View>
			)
	}
}

// Style definitions
const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    alignItems:"center",
    justifyContent :"center"
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:"flex-end",
    justifyContent :"center",
    paddingVertical:16,
    flexDirection:"row"
  },
  signupText: {
  	color:"rgba(255,255,255,0.6)",
  	fontSize:16
  },
  signupButton: {
    color:"#ffffff",
  	fontSize:16,
  	fontWeight:"500"
  }
});
