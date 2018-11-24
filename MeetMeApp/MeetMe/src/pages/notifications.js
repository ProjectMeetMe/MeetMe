import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from "react-native";

export default class NotificationCenter extends Component {

	render() {
		return(
			<View style={styles.container}>
				<View>
					<Text>I am notification Center</Text>
				</View>
			</View>	
			);
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:"#455a64",
    flex: 1,
    alignItems:"center",
    justifyContent :"center"
  }
});