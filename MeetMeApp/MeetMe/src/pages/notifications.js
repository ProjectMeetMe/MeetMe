import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from "react-native";
import { NetInfo } from 'react-native';
import {ListItem } from "react-native-elements";
import {YellowBox} from 'react-native';
import NavigationForm from "../components/navigationForm";

export default class NotificationCenter extends Component {

  constructor() {
    super();

    this.state = {
      token: "",
      refreshing: false,
      loading: true,
      query: "",
      notifications: [],
      notification:{},
    };
}

async componentDidMount() {
  YellowBox.ignoreWarnings(['Warning: Failed prop type: Prop']);

  await NetInfo.isConnected.fetch().then(async (isConnected) => {
    if(isConnected)
    {
      this.getNotification();
    }
    else
    {
      const usernotifications = await AsyncStorage.getItem("notifications");
      this.setState({
        notifications: JSON.parse(usernotifications),
        refreshing: false,
        loading: false,
      });
    }
  })
}

  async getNotification()
  {
    const usertoken = await AsyncStorage.getItem("token");

    var userNotifications = await fetch("http://104.42.79.90:2990/notification/getNotifications", {
      method: "get",
      headers:{
        "Authorization": "Bearer " + usertoken,
      }
      }).catch((error) => {
      //console.error(error);
    });

    const userNotification = await userNotifications.json();

    await AsyncStorage.setItem("notifications", JSON.stringify(userNotification.notifications)); 

    this.setState({
      notification: userNotification,
      notifications: userNotification.notifications,
      refreshing: false,
      loading: false,
      token: this.usertoken,
    });
  }

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
        <Text style={styles.Text}>No notifications found for you.</Text>
      </View>
    );
  };

	render() {
		return(
      <View  style={{flex: 1}}>
      <NavigationForm title="Notification" type="notification"></NavigationForm>
			<View style={styles.container}>
				<FlatList
          data={this.state.notifications}
          renderItem={({ item }) => (
          <ListItem 
            id={item.id}
            containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
            roundAvatar
            titleStyle={styles.titleText}
            title={item.description}
            subtitle={"Time: " + item.createdAt}
            //rightIcon={this.renderRightIcon()}
            hideChevron={true}
          >
          </ListItem>
        )}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.renderEmptyList}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={50}
        />  
			</View>	
      </View>
			);
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    //alignItems:"center",
    justifyContent :"center"
  },
  iconClose: {
    marginRight: 10,
    fontSize: 24,
    height: 22,
    color: "#CB3333",
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
  
  Text: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center",
  },
  titleText: {
    color:"#ffffff",
    fontWeight: "300",
    fontSize:16
  },
  subtitleText: {
    color:"#ced0ce",
    fontSize:14,
    fontWeight: "100"
  },
  
  addbutton: {
    width:50,
    height:36,
    textAlign:"center",
    backgroundColor:"#1c313a",
    borderRadius: 25,
    paddingVertical: 6
  },

  button: {
    width:300,
    backgroundColor:"#1c313a",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },

  buttonText: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },
});