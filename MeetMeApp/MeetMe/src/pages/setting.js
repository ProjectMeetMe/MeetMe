import React, { Component } from "react";
import { AppRegistry,View,Text,StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import NavBar from "react-native-nav";
import NavigationForm from "../components/navigationForm";
import CheckBox from 'react-native-check-box'
import createFragment from 'react-addons-create-fragment'; // ES6
import update from 'react-addons-update';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Setting extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['', 'SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'],
      widthArr: [60, 50, 50, 50, 50, 50, 50, 50],
      tableData: [],
      isChecked: false,
      isChecledMap: {  0 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       1 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       2 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       3 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       4 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       5 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       6 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       7 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       8 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                       9 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      10 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      11 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      12 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      13 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      14 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      15 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      16 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      17 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      18 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      19 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      20 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      21 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      22 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      23 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      24 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      25 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      26 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      27 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      28 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      29 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      30 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      31 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      32 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      33 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      34 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      35 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      36 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      37 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      38 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      39 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      40 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      41 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      42 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      43 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      44 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      45 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      46 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
                      47 : { 0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false}
                    }
                    
    }
  }

  selectButton(value) {
    Alert.alert(`This value is ${value}`);
  }

  // COORDINATES ARE ONLY USED FOR DISPLAY PURPOSES. 
  //Calculations are all done using "value" 
  unselectButton(value, X, Y) {
    this.setState({
      isChecledMap: update(this.state.isChecledMap, {X: {Y: {$set: true}}})
    });
    // var dayInteger = value % 7;
    // var whichHour = (value - dayInteger) / 14;
    // var whichDay;
    // switch(dayInteger) {
    //   case 0:
    //     whichDay = "SUN";
    //     break;
    //   case 1:
    //     whichDay = "MON";
    //     break;
    //   case 2:
    //     whichDay = "TUE";
    //     break;
    //   case 3:
    //     whichDay = "WED";
    //     break;
    //   case 4:
    //     whichDay = "THUR";
    //     break;
    //   case 5:
    //     whichDay = "FRI";
    //     break;
    //   case 6:
    //     whichDay = "SAT";
    //     break;
    //   default: 
    //     whichDay = "ERR";
    // }
    // Alert.alert(`Button #${value}, ${whichDay}, Hour: ${whichHour}, Coord (${X},${Y})`);

  }
	
	render(){
    const state = this.state;
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
    // width: 40, 
    // height: 35, 
    //marginLeft: 5, 
    //borderRadius: 2,
    // backgroundColor: '#ffffff', 
    backgroundColor: '#98fb98', 
  },

  unselectButton: { 
    // width: 40, 
    // height: 35, 
    //marginLeft: 5, 
    // borderRadius: 2 
    // backgroundColor: '#c8e1ff', 
    backgroundColor: '#A9A9A9', 
  },

  btnText: { 
    textAlign: 'center' 
  },


  
});