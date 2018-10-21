import React, { Component } from 'react';
import { AsyncStorage, AppRegistry,View,Text,StyleSheet,
    FlatList, ActivityIndicator, ScrollView } from 'react-native';
import NavBar from 'react-native-nav';
import NavigationForm from '../components/navigationForm';
import {List, ListItem, SearchBar } from 'react-native-elements';
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
      refreshing: false,
      loading: false,
    };
  }

  creategroup() {
		Actions.creategroup()
  }

  groupprofile() {
		Actions.groupprofile()
  }

  componentDidMount() {
    this.getGroups();
  }

  async getGroups()
  {
    const { groups, token, loading, refreshing } = this.state;
    const usertoken = await AsyncStorage.getItem("token");

    console.log("usertoken:  " + usertoken);

    var usergroups = await fetch('http://104.42.79.90:2990/group/getGroups', {
          method: 'get',
          headers:{
            'Authorization': 'Bearer ' + usertoken
          }
        });

    const usergroup = await usergroups.json();

    this.setState({
      token: usertoken,
      groups: usergroup.groups,
      loading: false,
      refreshing: false,
    });
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getGroups();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View style={styles.renderSeparator}/>
    );
  };

  renderHeader = () => {
    return <SearchBar 
            platform={'android'}
            clearIcon={{ color: 'grey' }}
            placeholder="Search Here..." 
            inputContainerStyle={styles.container} 
            //containerStyle={styles.container}
            round
            />;
  };

  renderFooter = () => {
    if (!this.state.loading) 
        return null;

    return (
      <View style={styles.renderFooter}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

	render(){

    const { groups, token } = this.state;

    if(groups == [""])
    {
      return(
        <View  style={{flex: 1}}>
          <NavigationForm type="My Groups"></NavigationForm>
          <View style={styles.container}>	
            <Text style={styles.Text}>You do not have any group yet.{'\n'}
                You can create a group or join a group.</Text>
          </View>
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="Create Group" 
              textStyle = {styles.itemStyle}
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Actions.creategroup()}}>
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
        <View style={{flex: 1, backgroundColor: '#455a64'}}>
          
          <NavigationForm type="My Groups"></NavigationForm>

          <FlatList
            data={this.state.groups}
            renderItem={({ item }) => (
              <ListItem 
                containerStyle={{backgroundColor: '#455a64', borderBottomWidth: 0}}
                roundAvatar
                titleStyle={styles.titleText}
                title={item.groupName}
                subtitleStyle={styles.subtitleText}
                subtitle={'Group ID: ' + item.id}
                //avatar={{ uri: item.picture.thumbnail }}
                //containerStyle={{ borderBottomWidth: 0 }}
                onPress={() => {Actions.groupprofile({groupID: item.id, groupName:item.groupName})}}>
              </ListItem>
            )}
            keyExtractor={item => item.groupName}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="Create Group" 
              textStyle = {styles.itemStyle}
              textContainerStyle = {styles.itemStyle}
              onPress={() => {Actions.creategroup()}}>
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

  renderFooter:
  {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },

  renderSeparator:
  {
    height: 1,
    width: "95%",
    backgroundColor: "grey",
    marginLeft: "2.5%",
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
  titleText: {
    color:'#ffffff',
    fontWeight: '300',
  	fontSize:18
  },
  subtitleText: {
  	color:'#ced0ce',
    fontSize:14,
    fontWeight: '100'
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
