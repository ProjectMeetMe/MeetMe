import React, { Component } from "react";
import { AsyncStorage, AppRegistry, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import NavigationForm from "../components/navigationForm";
import update from 'immutability-helper';
import CheckBox from 'react-native-check-box'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from "react-native-nav";
import {Image} from "react-native";

export default class Setting extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['', 'SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'],
      widthArr: [60, 50, 50, 50, 50, 50, 50, 50],
      tableData: [],
      isChecked: false,
      token: '',
      savedSchedule: ''
    }

    AsyncStorage.getItem("token").then((value) => {
      this.setState({token: value});
    }).done();
  }

  selectButton(value) {
    Alert.alert(`This value is ${value}`);
  }

  // COORDINATES ARE ONLY USED FOR DISPLAY PURPOSES. 
  //Calculations are all done using "value" 
  unselectButton(value, X, Y) {
    var dayInteger = value % 7;
    var whichHour = (value - dayInteger) / 14;
    var whichDay;
    switch(dayInteger) {
      case 0:
        whichDay = "SUN";
        break;
      case 1:
        whichDay = "MON";
        break;
      case 2:
        whichDay = "TUE";
        break;
      case 3:
        whichDay = "WED";
        break;
      case 4:
        whichDay = "THUR";
        break;
      case 5:
        whichDay = "FRI";
        break;
      case 6:
        whichDay = "SAT";
        break;
      default: 
        whichDay = "ERR";
    }
    Alert.alert(`Button #${value}, ${whichDay}, Hour: ${whichHour}, Coord (${X},${Y})`);

  }

  
  saveFreeTime = () => {
  
    //Call saveFreeTime API, send the user free time slots to
    //post API call with user token
    fetch("http://104.42.79.90:2990/user/editSchedule",{
        method:"put",
        headers:{
                  "Accept": "application/json",
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + token,
                },
        body:JSON.stringify({
          schedule: this.state.savedSchedule,
                })	
      })
      .then((response) => response.json())
      .then((responseJson) => {
            Toast.show(responseJson.message, Toast.LONG);
        });
}
	
	render(){
    const state = this.state;

    // const checkBox = (value) => (
    //   <CheckBox
    //     style={{flex: 1, padding: 10}}
    //     onClick={()=>{
    //       this.setState({
    //         isChecked: !this.state.isChecked
    //       })
    //     }}
    //     isChecked = {this.state.isChecked}
    //   //  leftText = {"CheckBox"}
    //   />
    //)

    const selectButton = (value) => (
     
      <TouchableOpacity onPress={() => this.selectButton(value)}>  
        <View style={styles.selectButton}>
          <Text style={styles.btnText}>*</Text>
        </View>
      </TouchableOpacity>
      
    )
    
    const unselectButton = (value, X, Y) => (
      <TouchableOpacity onPress={() => this.unselectButton(value, X, Y)}>
        <View 
         style={styles.unselectButton}>
          <Text style={styles.btnText}>!</Text>
        </View>
      </TouchableOpacity>
    );

    var half_hour = false;
    for (let i = 0; i < 48; i += 1) {
      const rowData = [];
      time = Math.floor(i /2);

      // WHOLE HOUR
      if(half_hour == false) {
        if(time <= 9) {
          rowData.push(`${0}${time}${':'}${0}${0}`);  
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(unselectButton(7*i + fill, i, fill)); 
          }
        } else {
          rowData.push(`${time}${':'}${0}${0}`);
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(unselectButton(7*i + fill, i, fill)); 
          }
        }
        half_hour = true;

      // HALF HOUR
      } else if(half_hour == true) {
        if(time <= 9) {
          rowData.push(`${0}${time}${':'}${3}${0}`);  
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(unselectButton(7*i + fill, i, fill)); 
          }
        } else {
          rowData.push(`${time}${':'}${3}${0}`);
          for (let fill = 0; fill < 7; fill++) { 
            rowData.push(unselectButton(7*i + fill, i, fill)); 
          }
        }
        half_hour = false;
    }
      state.tableData.push(rowData);
  //    this.setState({
    //    tableData: update(this.state.tableData, {1: {$set: '1'}})
     // })
    }
   
		return(
      <View style={{flex: 1}}>
      <NavBar style={style}>          
            <NavButton style={styles.navButton}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {this.props.title}
          </NavTitle>
            <NavButton style={styles.navButton} 
                onPress={this.saveFreeTime}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
                source={require("../images/android_icon_save.png")}
              />
            </NavButton>
         </NavBar> 
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text2}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  state.tableData.map((rowData, index) => (
                    
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text2}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View> 
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

  button: {
    width:300,
    backgroundColor:"#1c313a",
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  Text: {
    fontSize:16,
    fontWeight:"500",
    color:"#ffffff",
    textAlign:"center"
  },
  header: { 
    height: 50, 
    backgroundColor: '#537791' 
  },

  text2: { 
    textAlign: 'center', 
    fontWeight: '100' 
  },

  dataWrapper: { 
    marginTop: -1 
  },

  row: { 
    height: 40, 
    backgroundColor: '#E7E6E1' 
  },

  selectButton: { 
    width: 40, 
    height: 35, 
    marginLeft: 5, 
    backgroundColor: '#ffffff', 
    borderRadius: 2 
  },

  unselectButton: { 
    width: 40, 
    height: 35, 
    marginLeft: 5, 
    backgroundColor: '#c8e1ff', 
    borderRadius: 2 
  },

  btnText: { 
    textAlign: 'center' 
  },

  statusBar: {
    backgroundColor: "#212121",
  },
  navBar: {
    backgroundColor: "#212121",
    borderTopWidth: 0,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 0,
  },
  title: {
    color: "#CECECE",
    textAlign: 'center',
  },
  buttonText: {
    color: "rgba(231, 37, 156, 0.5)",
  },
  navGroup: {
    justifyContent: "flex-end",
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
  },
  
});