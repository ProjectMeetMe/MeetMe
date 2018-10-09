import React, { Component } from 'react';
import { AsyncStorage, AppRegistry,View,Text,StyleSheet,FlatList } from 'react-native';
import NavBar from 'react-native-nav';
import NavigationForm from '../components/navigationForm';
import {List, ListItem} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

export default class Home extends Component{
  
  constructor() {

    super();

    this.state = {
      token: '',
      groups: [],
      isRefreshing: false,
    };

    AsyncStorage.getItem("token").then((value) => {
      if (value != ''){
        this.setState({token: value});
      } else {
        this.setState({token: ''});
      }
    }).done();
  }

  createGroup() {
		Actions.createGroup()
  }

	render(){

    const { groups, token } = this.state;

    fetch('http://104.42.79.90:2990/group/getGroups', {
      method: 'GET',
      headers:{
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => response.json())
    .then((responseJson)=>{ 
      //Toast.show(responseJson.group, Toast.LONG);
      groups = responseJson;
    });
 
    Toast.show(JSON.stringify(groups.group), Toast.LONG);

    if(groups.length == 0)
    {
      return(
        <View  style={{flex: 1}}>
          <NavigationForm type="My Group"></NavigationForm>
          <View style={styles.container}>	
            <Text style={styles.Text}>You do not have any group yet.{'\n'}
                You can create a group or join a group.</Text>
          </View>
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="Create Group" 
              textStyle = {styles.itemStyle}
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Actions.createGroup()}}>
              {<Icon name="md-add" style={styles.actionButtonIcon} />}
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Join Group"
              textStyle = {styles.itemStyle} 
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Toast.show("Join Group")}}>
              <Icon name="md-person-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
      );
    }
    else
    {
      return(
        <View style={{flex: 1}}>
          <NavigationForm type="My Group"></NavigationForm>
          <List styles={styles.scene}>
              <FlatList
                  data={groups}
                      renderItem={({item}) => (
                          <ListItem
                              roundAvatar
                              title={item.groupName}
                              subtitle={item.id}
                              //avatar={{uri: item.picture.thumbnail}}
                          />
                      )}
                      keyExtractor={i => i.id}
                      onEndThreshold={0}
                      />
          </List>
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="Create Group" 
              textStyle = {styles.itemStyle}
              textContainerStyle = {styles.itemStyle}
              onPress={this.createGroup()}>
              {<Icon name="md-add" style={styles.actionButtonIcon} />}
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Join Group"
              textStyle = {styles.itemStyle} 
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Toast.show("Join Group")}}>
              <Icon name="md-person-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View> 
      );
    }

	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#455a64',
    flexDirection: 'row',
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: '#1c313a',
  },

  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  Text: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },

scene: {
    flex: 1,
    paddingTop: 25,
},
user: {
    width: '100%',
    backgroundColor: '#333',
    marginBottom: 10,
    paddingLeft: 25,
},
userName: {
    fontSize: 17,
    paddingVertical: 20,
    color: '#fff'
},

itemStyle: {
  backgroundColor: '#1c313a',
  color: '#ffffff'
}
});
