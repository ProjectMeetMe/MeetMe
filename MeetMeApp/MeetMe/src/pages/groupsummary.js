import React, { Component } from "react";
import { AppRegistry,View,Text,StyleSheet,TouchableOpacity } from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import Toast from "react-native-simple-toast";
import { Actions } from "react-native-router-flux";


export default class GroupSummary extends Component{
leaveGroup() {
  Toast.show("Leave group to be implemented", Toast.LONG);
  Actions.popTo("home");
}
  
	render(){
		return(
      <View style={{flex: 1}}>
      <NavigationForm title="Group Summary" type="groupSummary"></NavigationForm>
        <View style={styles.container}>
          <Text style={styles.Text}>I am GroupSummary page.</Text>
        </View>

	  		<View style={styles.container}>	
          <TouchableOpacity style={styles.logoutButton} onPress={this.leaveGroup}>
            <Text style={styles.logoutButtonText}>Leave Group</Text>
          </TouchableOpacity> 
			  </View>

        
      </View> 
		);
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"#455a64",
    flexDirection: "row",
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
    textAlign:"center"
  },
  logoutButton: {
    width:300,
    backgroundColor:"#CB3333",
     borderRadius: 10,
      marginVertical: 10,
      paddingVertical: 13
  },
  logoutButtonText: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },
  
});