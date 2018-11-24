import React, { Component } from "react";
import { AsyncStorage,View,Text,StyleSheet,
    FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import { Actions } from "react-native-router-flux";
import {List, ListItem, SearchBar } from "react-native-elements";
import Toast from "react-native-simple-toast";
import ActionButton from "react-native-action-button";
import FetchAPI from "../controller/fetchAPI";
import {YellowBox} from 'react-native';
import Dialog, {
  DialogTitle,
  DialogButton,
} from 'react-native-popup-dialog';
import Icon from "react-native-vector-icons/Foundation";
import Home from "../pages/home";

export default class GroupSummary extends Component{
	
  constructor(props) {

    super(props);

    this.state = {
      token: "",
      members: [],
      userId: "",
      ownerId: "",
      refreshing: false,
      loading: true,
      customBackgroundDialog: false,
      showDialog: false,
      deleteUserId: 0,
      deleteUserName: "",
    };
  }

  // Ignore popup dialog warnings
  componentDidMount() {
    YellowBox.ignoreWarnings(['Warning: Failed prop type: Prop']);
    this.getGroupInfo();
  }

  //Call getGroup API to reterive all information about this
  //group
  async getGroupInfo()
  {
    const usertoken = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userid");
    var groupId = this.props.groupID;

    var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo?groupId=" + groupId, {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });

    const groupinfojson = await groupInfos.json();

    this.setState({
      members: groupinfojson.groupInfo.users,
      loading: false,
      refreshing: false,
      userId: userId,
      ownerId: groupinfojson.groupInfo.leaderId
    });
  }

  async deleteGroupMember()
  {
    const usertoken = await AsyncStorage.getItem("token");
    var groupId = this.props.groupID;

    console.log("this.state.deleteUserId: =============" + this.state.deleteUserId);

    var memberRemove = await fetch("http://104.42.79.90:2990/group/removeMember?groupId=" + groupId, {
          method: "put",
          headers:{
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + usertoken,
          },
          body:JSON.stringify({
            userId: this.state.deleteUserId,
          })
        });

    const memberRemoveJson = await memberRemove.json();
    Toast.show(memberRemoveJson.message, Toast.LONG);
  }

  async leaveGroup() 
  {
    const usertoken = await AsyncStorage.getItem("token");
    var groupId = this.props.groupID;
  
    var leaveGroup = await fetch("http://104.42.79.90:2990/group/leaveGroup?groupId=" + groupId, {
          method: "post",
          headers:{
            "Accept": "application.json",
            "Content-type": "application.json",
            "Authorization": "Bearer " + usertoken,
          },
        });
  
    const leaveGroupJson = await leaveGroup.json();
    Toast.show(leaveGroupJson.message, Toast.LONG);
    Actions.popTo("home");
  }
  
  async destroyGroup() 
  {
    const usertoken = await AsyncStorage.getItem("token");
    var groupId = this.props.groupID;
    
    console.log("usertoken+++++++" + usertoken);
    console.log("groupId+++++++" + groupId);
    var destroyGroup = await fetch("http://104.42.79.90:2990/group/destroyGroup?groupId=" + groupId, {
          method: "delete",
          headers:{
            "Accept": "application.json",
            "Content-type": "application.json",
            "Authorization": "Bearer " + usertoken,
          },
        });
  
    const destroyGroupJson = await destroyGroup.json();
    Toast.show(destroyGroupJson.message, Toast.LONG);
    Actions.reset("home");
    Actions.popTo("home");
    
  }

  // Delete group from database and remove all members
  // destroyGroup() 
  // {
  //   Toast.show("Destroy Group function to be implemented", Toast.LONG);
  // }
  // Pull-down refresh
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getGroupInfo();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View style={styles.renderSeparator}/>
    );
  };

  // Display searchbar
  
  renderHeader = () => {
    return <Text style={styles.headerText}>    Group Members</Text>;
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
  // Note: This should never be the case since group owner will belong to the group
  renderEmptyList = () => {
    if (this.state.loading) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.Text}>There is nobody in this group. Try to
              add more people to your group!</Text>
      </View>
    );
  };

  // Dialog when kicking a member
  renderPopupDialog(){
    if(this.state.userId == this.state.ownerId)
    {
      return(
        <Dialog
          //dialogStyle={styles.dialogStyle}
          onDismiss={() => {
            this.setState({ customBackgroundDialog: false });
          }}
          onTouchOutside={() => {
            this.setState({ customBackgroundDialog: false });
          }}
          width={0.75}
          visible={this.state.customBackgroundDialog}
          rounded={false}
          dialogTitle={
            <DialogTitle
              title={"Are you sure to delete " + this.state.deleteUserName 
                        + " from this group?"}
              textStyle={styles.dialogTitle}
              hasTitleBar={false}
              align="center"
            />
          }
          actions={[
            <DialogButton
              text="CANCEL"
              onPress={() => {
                this.setState({ customBackgroundDialog: false });
              }}
              key="cancel"
              style={styles.dialogButton}
              textStyle={styles.cancelButtonText}
            />,
            <DialogButton
              text="DELETE"
              onPress={() => {
                this.deleteGroupMember();
                this.setState({ customBackgroundDialog: false });
              }}
              key="delete"
              style={styles.dialogButton}
              textStyle={styles.deleteButtonText}
            />,
          ]}
        >
        </Dialog>
      );          
    }
  }

  renderLeaveDialog(){
    if(this.state.userId != this.state.ownerId) {
    return(
      <Dialog
        //dialogStyle={styles.dialogStyle}
        onDismiss={() => {
          this.setState({ showDialog: false });
        }}
        onTouchOutside={() => {
          this.setState({ showDialog: false });
        }}
        width={0.75}
        visible={this.state.showDialog}
        rounded={false}
        dialogTitle={
          <DialogTitle
            title={"Are you sure you want to leave this group?"}
            textStyle={styles.dialogTitle}
            hasTitleBar={false}
            align="center"
          />
        }
        actions={[
          <DialogButton
            text="Cancel"
            onPress={() => {
              this.setState({ showDialog: false });
            }}
            key="cancel"
            style={styles.dialogButton}
            textStyle={styles.cancelButtonText}
          />,
          <DialogButton
            text="Leave"
            onPress={() => {
              this.leaveGroup();
              this.setState({ showDialog: false });
            }}
            key="leave"
            style={styles.dialogButton}
            textStyle={styles.deleteButtonText}
          />,
        ]}
        >
        </Dialog>
  );
  } else {
    return(
      <Dialog
        //dialogStyle={styles.dialogStyle}
        onDismiss={() => {
          this.setState({ showDialog: false });
        }}
        onTouchOutside={() => {
          this.setState({ showDialog: false });
        }}
        width={0.75}
        visible={this.state.showDialog}
        rounded={false}
        dialogTitle={
          <DialogTitle
            title={"Are you sure you want to destroy this group? \n This action can not be undone."}
            textStyle={styles.dialogTitle}
            hasTitleBar={false}
            align="center"
          />
        }
        actions={[
          <DialogButton
            text="Cancel"
            onPress={() => {
              this.setState({ showDialog: false });
            }}
            key="cancel"
            style={styles.dialogButton}
            textStyle={styles.cancelButtonText}
          />,
          <DialogButton
            text="Yes"
            onPress={() => {
              this.destroyGroup();
              this.setState({ showDialog: false });
            }}
            key="leave"
            style={styles.dialogButton}
            textStyle={styles.deleteButtonText}
          />,
        ]}
        >
        </Dialog>
    );
  }
}

  //get preperty for righticon in ListItem
  renderRightIcon(itemId, itemName){
    if(itemId == this.state.ownerId)
    {
      return(
        <Icon name="crown" style={styles.iconCrown}/>
      );          
    }
    else
    {
      return(
        <Icon name="x" style={styles.iconClose}                
         onPress={() => {
          if(this.state.userId == this.state.ownerId && itemId != this.state.ownerId)
          {
            this.setState({
              customBackgroundDialog: true,
              deleteUserId: itemId,
              deleteUserName: itemName,
            });
          }
        }}/>
      ); 
    }
  }

	render(){
    if(this.state.userId != this.state.ownerId) {
      return(
        <View style={{flex: 1, backgroundColor: "#455a64"}}>
          <NavigationForm title="Group Summary" type="groupsummary"></NavigationForm>
          <FlatList
            data={this.state.members}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
                roundAvatar
                id={item.id}
                titleStyle={styles.titleText}
                title={item.firstname + " " + item.lastname}
                subtitleStyle={styles.subtitleText}
                subtitle={"Email: " + item.email}
                rightIcon={this.renderRightIcon(item.id, item.firstname + " " + item.lastname)}
                hideChevron={this.state.userId != this.state.ownerId && item.id != this.state.ownerId ? true : false}
                >
              </ListItem>
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            ListEmptyComponent={this.renderEmptyList}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <View style={styles.container}>	
            <TouchableOpacity style={styles.leaveGroupButton} 
              onPress={() => {
                this.setState({ showDialog: true });
  
              }}
            >
              <Text style={styles.leaveGroupButtonText}>Leave Group</Text>
            </TouchableOpacity> 
          </View>
          
        { this.renderPopupDialog() }
        { this.renderLeaveDialog() }
        </View> 
      );
    } else {
      return(
        <View style={{flex: 1, backgroundColor: "#455a64"}}>
          <NavigationForm title="Group Summary" type="groupsummary"></NavigationForm>
          <FlatList
            data={this.state.members}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={{backgroundColor: "#455a64", borderBottomWidth: 0}}
                roundAvatar
                id={item.id}
                titleStyle={styles.titleText}
                title={item.firstname + " " + item.lastname}
                subtitleStyle={styles.subtitleText}
                subtitle={"Email: " + item.email}
                rightIcon={this.renderRightIcon(item.id, item.firstname + " " + item.lastname)}
                hideChevron={this.state.userId != this.state.ownerId && item.id != this.state.ownerId ? true : false}
                >
              </ListItem>
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            ListEmptyComponent={this.renderEmptyList}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <View style={styles.container}>	
            <TouchableOpacity style={styles.leaveGroupButton} 
              onPress={() => {
                this.setState({ showDialog: true });
  
              }}
            >
            
              <Text style={styles.leaveGroupButtonText}>Destroy Group</Text>
            </TouchableOpacity> 
          </View>
          
        { this.renderPopupDialog() }
        { this.renderLeaveDialog() }
        </View> 
      );
    }
  }
	
}

// Style definitions
const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"#455a64",
    flexDirection: "row",
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
  	fontSize:18
  },
  subtitleText: {
  	color:"#ced0ce",
    fontSize:14,
    fontWeight: "100"
  },

  headerText: {
  	color:"#ffffff",
    fontSize:18,
    fontWeight: "300",
    textAlignVertical: "bottom",
    },

  dialogStyle: {
    backgroundColor: "#212121",
},

  dialogTitle: {
    fontSize:16,
    fontWeight:"200",
    color:"#000000",
    textAlign:"center",
},

  deleteButtonText: {
    fontSize:20,
    fontWeight:"300",
    color:"#CB3333",
    textAlign:"center",
},

  cancelButtonText: {
    fontSize:16,
    fontWeight:"200",
    color:"#000000",
    textAlign:"center",
},

  dialogButton: {
    backgroundColor: "#CB3333",
},

leaveGroupButton: {
  width:300,
  backgroundColor:"#CB3333",
  borderRadius: 10,
  marginVertical: 10,
  paddingVertical: 13,
  textAlignVertical: "bottom"  
  
},
leaveGroupButtonText: {
  fontSize:16,
  fontWeight:"500",
  color:"#ffffff",
  textAlign:"center"
},

iconCrown: {
  marginRight: 10,
  fontSize: 24,
  height: 22,
  color: "#FFD700",
},

iconClose: {
  marginRight: 10,
  fontSize: 24,
  height: 22,
  color: "#CB3333",
},

});