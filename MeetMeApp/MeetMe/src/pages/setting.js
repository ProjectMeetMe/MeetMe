import React, { Component } from "react";
import { AppRegistry,View,Text,StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import CheckBox from 'react-native-check-box'

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Setting extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['', 'SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'],
      widthArr: [60, 50, 50, 50, 50, 50, 50, 50],
      tableData: [],
      isChecked: false
    }
  }

  selectButton(value) {
    Alert.alert(`This value is ${value}`);
  }

  unselectButton(value) {
    Alert.alert(`This value is ${value}`);

  }
	
	render(){
    const state = this.state;

    const checkBox = (value) => (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={()=>{
          this.setState({
            isChecked: !this.state.isChecked
          })
        }}
        isChecked = {this.state.isChecked}
      //  leftText = {"CheckBox"}
      />
    )

    const selectButton = (value) => (
      <TouchableOpacity onPress={() => this.selectButton(value)}>
        <View style={styles.selectButton}>
          <Text style={styles.btnText}>*</Text>
        </View>
      </TouchableOpacity>
    )
    
    const unselectButton = (value) => (
      <TouchableOpacity onPress={() => this.unselectButton(value)}>
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
            rowData.push(checkBox('0')); 
          }
        } else {
          rowData.push(`${time}${':'}${0}${0}`);
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(unselectButton('0')); 
          }
        }
        half_hour = true;

      // HALF HOUR
      } else if(half_hour == true) {
        if(time <= 9) {
          rowData.push(`${0}${time}${':'}${3}${0}`);  
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(checkBox('0')); 
          }
        } else {
          rowData.push(`${time}${':'}${3}${0}`);
          for (let fill = 0; fill < 7; fill++ ) { 
            rowData.push(unselectButton('0')); 
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
      <NavigationForm title="Setting" type="setting"></NavigationForm>
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
  header: { height: 50, backgroundColor: '#537791' },
  text2: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  selectButton: { width: 40, height: 35, marginLeft: 5, backgroundColor: '#ffffff', borderRadius: 2 },
  unselectButton: { width: 40, height: 35, marginLeft: 5, backgroundColor: '#c8e1ff', borderRadius: 2 },
  btnText: { textAlign: 'center' }
  
});