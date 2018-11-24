import React, { Component } from "react";
import {Router, Stack, Scene} from "react-native-router-flux";
import {AsyncStorage, Text, View, StyleSheet} from "react-native";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Setting from "./pages/setting";
import CreateGroup from "./pages/creategroup";
import JoinGroup from "./pages/joingroup";
import GroupProfile from "./pages/groupprofile";
import CreateEvent from "./pages/createevent";
import GroupInformation from "./pages/groupinformation";
import GroupSummary from "./pages/groupsummary";
import SuggestEvent from "./pages/suggestevent";
import UserCalendar from "./pages/usercalendar";
import NotificationCenter from "./pages/notifications";
import {YellowBox} from 'react-native';

export default class Routes extends Component{

	constructor(props) {
		super(props);
		this.state = {
		  logged: false,
		  loading: true,
		};
	  };

	//check whether user is already logged in or not
	componentWillMount(){
		YellowBox.ignoreWarnings(['Require cycles are allowed']);
		AsyncStorage.getItem("token")
		.then( (value) => 
		{
			if (value != null){
			  this.setState({
				logged: true,
				loading: false,
			  });
			} else{
			  this.setState({
				loading: false,
			  });
			}
		});
	  };

	//loading screen while app is checking user login status
	render() {
		if (this.state.loading) {
			return <View style={styles.container}>
					<Text style={styles.Text}>Loading...</Text>
					</View>;
		}
		return(
			<Router>
			    <Stack key="root" hideNavBar={true}>
					<Scene key="login" component={Login} title="Login" initial={!this.state.logged}/>
			    <Scene key="signup" component={Signup} title="Register"/>
					<Scene key="home" component={Home} title="HomePage" initial={this.state.logged}/>
					<Scene key="profile" component={Profile} title="ProfilePage"/>
					<Scene key="usercalendar" component={UserCalendar} title="UserCalendar"/>
					<Scene key="notifications" component={NotificationCenter} title="NotificationCenter"/>
					<Scene key="creategroup" component={CreateGroup} title="CreateGroup"/>
					<Scene key="joingroup" component={JoinGroup} title="JoinGroup"/>
					<Scene key="groupprofile" component={GroupProfile} title="GroupProfile"/>
					<Scene key="createevent" component={CreateEvent} title="CreateEvent"/>
					<Scene key="suggestevent" component={SuggestEvent} title="SuggestEvent"/>
					<Scene key="setting" component={Setting} title="SettingPage"/>
					<Scene key="groupinformation" component={GroupInformation} title="GroupInformation"/>
					<Scene key="groupsummary" component={GroupSummary} title="GroupSummary"/>
			    </Stack>
			</Router>
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
	Text: {
		fontSize:16,
		fontWeight:"500",
		color:"#ffffff",
		textAlign:"center",
	  },
});