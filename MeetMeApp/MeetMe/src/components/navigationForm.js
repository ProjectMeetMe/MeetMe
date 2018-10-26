import React, { Component } from "react";
import {Image} from "react-native";
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from "react-native-nav";
import {Actions} from "react-native-router-flux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity 
} from "react-native";

//This function generate the navigation bar that display at
//the top of this app
export default class NavigationForm extends Component {

  constructor(props){
    super(props);
    }

  //redirect this app to profile page
  profile() {
	  Actions.profile();
  }

  //redirect this app to seeting page
  setting() {
    Actions.setting();
  }

  //notice that this app will not open a new page if 
  //user click profile icon in profile page or user
  //click setting icon in setting page
  render() {
    if(this.props.type === "profile" || this.props.type === "setting"
      || this.props.type === "createGroup" || this.props.type === "createEvent"
      || this.props.type === "joinGroup" 
      || this.props.type === "groupSummary" || this.props.type === "groupMember")
    {
      return (
        <NavBar style={styles}>
          <NavButton style={styles.navButton}>
          </NavButton>
          <NavTitle  style={styles.title}>
          {this.props.title}
          </NavTitle>
          <NavButton style={styles.navButton}>
          </NavButton>
         </NavBar> 
      );
    }
    else if(this.props.type === "home")
    {
      return (
        <NavBar style={styles}>
            <NavButton style={styles.navButton} onPress={this.profile}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_account.png")}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.title}
          </NavTitle>
            <NavButton style={styles.navButton} onPress={this.setting}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_setting.png")}
              />
            </NavButton>
         </NavBar> 
      );
    }
    else if(this.props.type === "groupprofile")
    {
      return (
        <NavBar style={styles}>
            <NavButton style={styles.navButton} 
                onPress={() => {Actions.groupmember({groupID: this.props.groupID});
                }}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_account.png")}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.title}
          </NavTitle>
            <NavButton style={styles.navButton} 
                onPress={() => {Actions.groupsummary({groupID: this.props.groupID});
                }}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_setting.png")}
              />
            </NavButton>
         </NavBar> 
      )
    }
    else
    {
      return (
        <NavBar style={styles}>
            <NavButton style={styles.navButton} onPress={this.profile}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_account.png")}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.type}
          </NavTitle>
            <NavButton style={styles.navButton} onPress={this.setting}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_setting.png")}
              />
            </NavButton>
         </NavBar> 
      )
    }
  }
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#212121",
  },
  navBar: {
    backgroundColor: "#212121",
    borderTopWidth: 0,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 0,
  },
  title: {
    color: "#CECECE",
  },
  buttonText: {
    color: "rgba(231, 37, 156, 0.5)",
  },
  navGroup: {
    justifyContent: "flex-end",
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
  },
});

