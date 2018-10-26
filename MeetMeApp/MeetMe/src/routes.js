import React, { Component } from "react";
import {Router, Stack, Scene} from "react-native-router-flux";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Setting from "./pages/setting";
import CreateGroup from "./pages/creategroup";
import JoinGroup from "./pages/joingroup";
import GroupProfile from "./pages/groupprofile";
import CreateEvent from "./pages/createevent";
import GroupMember from "./pages/groupmember";
import GroupSummary from "./pages/groupsummary";

export default class Routes extends Component{
	render() {
		return(
			<Router>
			    <Stack key="root" hideNavBar={true}>
					<Scene key="login" component={Login} title="Login" initial={true}/>
			    	<Scene key="signup" component={Signup} title="Register"/>
					<Scene key="home" component={Home} title="HomePage"/>
					<Scene key="profile" component={Profile} title="ProfilePage"/>
					<Scene key="creategroup" component={CreateGroup} title="CreateGroup"/>
					<Scene key="joingroup" component={JoinGroup} title="JoinGroup"/>
					<Scene key="groupprofile" component={GroupProfile} title="GroupProfile"/>
					<Scene key="createevent" component={CreateEvent} title="CreateEvent"/>
					<Scene key="setting" component={Setting} title="SettingPage"/>
					<Scene key="groupmember" component={GroupMember} title="GroupMember"/>
					<Scene key="groupsummary" component={GroupSummary} title="GroupSummary"/>
			    </Stack>
			</Router>
			)
	}
}
