import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import Profile from './pages/profile';
import Setting from './pages/setting';

export default class Routes extends Component{
	render() {
		return(
			<Router>
			    <Stack key="root" hideNavBar={true}>
			      <Scene key="login" component={Login} title="Login" initial={true}/>
			      <Scene key="signup" component={Signup} title="Register"/>
				  <Scene key="home" component={Home} title="HomePage"/>
				  <Scene key="profile" component={Profile} title="ProfilePage"/>
				  <Scene key="setting" component={Setting} title="SettingPage"/>
			    </Stack>
			 </Router>
			)
	}
}