import React, { Component } from "react";
import { AsyncStorage,View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView  } from "react-native";
import NavigationForm from "../components/navigationForm";
import { Actions } from "react-native-router-flux";

import Dialog, {
  DialogTitle,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';
import Toast from "react-native-simple-toast";


export default class GroupInformation extends Component{
	
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      refreshing: false,
      loading: true,
      showDialog: false,
      newDescription: "",
      userid: "",
      groupinfo: "",
      groupID: 0,
    };
  }

  //at the begining of this page execute below functions
  componentDidMount() {
    //YellowBox.ignoreWarnings(['Warning: Failed prop type: Prop']);
    this.getGroupInfo();
  }

  //Call getGroup API to reterive all information about this
  //group
  async getGroupInfo()
  {
    const { events, token, userid} = this.state;
    const curuserid = await AsyncStorage.getItem("userid");
    const usertoken = await AsyncStorage.getItem("token");

    var groupId = this.props.groupID;

    var groupInfos = await fetch("http://104.42.79.90:2990/group/getGroupInfo?groupId=" + groupId, {
          method: "get",
          headers:{
            "Authorization": "Bearer " + usertoken,
          }
        });

    const groupinfojson = await groupInfos.json();
    
    this.setState({
      groupinfo: groupinfojson.groupInfo,
      //leaderId: groupinfojson.groupInfo.leaderId,
      userid: curuserid,
      groupID: groupId,
    });
  }


  async updateGroupDescription() {
      const usertoken = await AsyncStorage.getItem("token");
    
      var groupUpdate = await fetch("http://104.42.79.90:2990/group/editGroupDescription?groupId=" + this.state.groupID, {
            method: "put",
            headers:{
              "Accept": "application/json",
              "Content-type": "application/json",
              "Authorization": "Bearer " + usertoken,
            },
            body:JSON.stringify
            ({
              groupDescription: this.state.newDescription, 
            })
          });
  
      const groupUpdateJson = await groupUpdate.json();

      Toast.show(groupUpdateJson.updatedInfo.description, Toast.LONG);
      this.getGroupInfo();

      
  }

  renderEditDialog() {
    return(
      <Dialog
        onDismiss={() => {
          this.setState({ showDialog: false });
        }}
        onTouchOutside={() => {
          this.setState({ showDialog: false });
        }}
        rounded={false}
        width={0.9}
        visible={this.state.showDialog}
        dialogTitle={
          <DialogTitle
            title={"Update Group Notes"}
            textStyle={styles.dialogTitle}
            hasTitleBar={this.state.showDialog}
            align="center"
          />
        }
        actions={[
          <DialogButton
            text="CANCEL"
            onPress={() => {
              this.setState({ showDialog: false });
            }}
            key="cancel"
            style={styles.dialogButton}
            textStyle={styles.cancelButtonText}
          />,
          <DialogButton
            text="SAVE"
            onPress={() => {
              this.updateGroupDescription();
              this.setState({ showDialog: false });
            }}
            key="save"
            style={styles.dialogButton}
            textStyle={styles.deleteButtonText}
          />,
        ]}
      >
      <DialogContent>
        {
          <TextInput style={styles.longInputBox} 
          multiline={true}
          textAlignVertical={"top"}
          underlineColorAndroid="rgba(0,0,0,0)" 
          defaultValue={this.state.groupinfo.description}
          selectionColor="#000000"
          keyboardType="email-address"
          onChangeText={(newDescription) => this.setState({newDescription})}
      />
        }
      </DialogContent>
      </Dialog>
    );   
  }    

	render(){
      return(
        <View style={{flex: 1, backgroundColor: "#455a64"}}>          
          <NavigationForm title="Group Information" type="groupinformation"></NavigationForm>
          <ScrollView contentContainerStyle={styles.contentContainer}>
          <View justifyContent="center" alignItems= "center">
            <Text style={styles.longInputBox} 
                    multiline={true}
                    textAlignVertical={"top"}
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Group Description"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address">{this.state.groupinfo.description}</Text>
          </View>
          {/* <View>
          <Text style={styles.longInputBox} 
                    multiline={true}
                    textAlignVertical={"top"}
                    underlineColorAndroid="rgba(0,0,0,0)" 
                    placeholder="Group Description"
                    placeholderTextColor = "#ffffff"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    //onChangeText={(description) => this.setState({description})}
          />{this.state.groupinfo.description}</Text>
          </View> */}

          <View style={styles.container}>	
            <TouchableOpacity style={styles.editButton} 
              onPress={() => {
                this.setState({ showDialog: true });
              }}
            >
              <Text style={styles.editButtonText}>Edit Group Notes</Text>
            </TouchableOpacity> 
          </View>
        
        { this.renderEditDialog() }
        </ScrollView>
        </View> 
      );
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
    fontWeight:"400",
    color:"#ffffff",
    textAlign:"left",
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

editButton: {
  width:300,
  backgroundColor:"#1c313a",
   borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 13
},
editButtonText: {
  fontSize:16,
  fontWeight:"500",
  color:"#ffffff",
  textAlign:"center"
},

longInputBox: {
  minHeight: 100,
  width:300,
  backgroundColor:"rgba(255, 255,255,0.2)",
  //borderRadius: 25,
  paddingHorizontal:16,
  fontSize:16,
  color:"#ffffff",
  marginVertical: 10
},

});