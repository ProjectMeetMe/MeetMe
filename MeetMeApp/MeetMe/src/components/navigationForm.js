import React, { Component } from 'react';
import {Image} from 'react-native';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity 
} from 'react-native';

export default class NavigationForm extends Component {

  constructor(props){
    super(props);
    }

  profile() {
	  Actions.profile()
  }

  setting() {
    Actions.setting()
}

  render() {
    if(this.props.type == "Profile")
    {
      return (
        <NavBar style={styles}>
            <NavButton style={styles.navButton}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require('../images/android_icon_account.png')}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.type}
          </NavTitle>
            <NavButton style={styles.navButton} onPress={this.setting}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require('../images/android_icon_setting.png')}
              />
            </NavButton>
         </NavBar> 
      )
    }
    else if(this.props.type == "Setting")
    {
      return (
        <NavBar style={styles}>
            <NavButton style={styles.navButton} onPress={this.profile}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require('../images/android_icon_account.png')}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.type}
          </NavTitle>
            <NavButton style={styles.navButton}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require('../images/android_icon_setting.png')}
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
                source={require('../images/android_icon_account.png')}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.type}
          </NavTitle>
            <NavButton style={styles.navButton} onPress={this.setting}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require('../images/android_icon_setting.png')}
              />
            </NavButton>
         </NavBar> 
      )
    }
  }
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#212121',
  },
  navBar: {
    backgroundColor: '#212121',
    borderTopWidth: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: 0,
  },
  title: {
    color: '#CECECE',
  },
  buttonText: {
    color: 'rgba(231, 37, 156, 0.5)',
  },
  navGroup: {
    justifyContent: 'flex-end',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
  },
})

