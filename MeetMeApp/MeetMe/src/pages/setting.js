import React, { Component } from "react";
import { AsyncStorage, AppRegistry, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import NavigationForm from "../components/navigationForm";
import { Table, Row, } from 'react-native-table-component';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from "react-native-nav";
import {Image} from "react-native";
import Toast from "react-native-simple-toast";
import update from 'react-addons-update';
import {Actions} from "react-native-router-flux";


export default class Setting extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['', 'SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'],
      widthArr: [60, 50, 50, 50, 50, 50, 50, 50],
      tableData: [],
      oldAvailability: {},
      isRendered: false,
      token: '',
      savedSchedule: {},
      Mon: [],
      Tues: [],
      Wed: [],
      Thurs: [],
      Fri: [],
      Sat: [],
      Sun: [],
      boxChoose:[
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0],
                ]
    }

    AsyncStorage.getItem("token").then((value) => {
      this.setState({token: value});
    }).done();
  }

  async componentDidMount() {
    this.getUserAvailability();
    console.log("THIS IS THE OLD AVAIL +++++++" + this.state.oldAvailability);
    this.renderTable();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.profileOrError === null) {
  //     // At this point, we're in the "commit" phase, so it's safe to load the new data.
  //     this._loadUserData();
  //   }
  // }

  // componentDidUpdate()
  // {
  //   this.renderTable();
  // }

  // updateStateboxChoose(whichDay, whichHour, bool)
  // {
  //   this.setState({
  //     boxChoose: update(this.state.boxChoose, {whichDay: {whichHour: bool}})
  //   })
  // }

  // COORDINATES ARE ONLY USED FOR DISPLAY PURPOSES. 
  //Calculations are all done using "value" 
  buttonAction(value, X, Y) {
    const state = this.state;

    var dayInteger = value % 7;
    var whichHour = (value - dayInteger) / 14;
    var whichDay;
    var day, index;

    switch(dayInteger) {
      case 0:
        whichDay = "SUN";
        day = state.Sun;
        if(!day.includes(whichHour)) {
          day.push(whichHour);
          this.setState({ Sun: day });
          this.state.boxChoose[X][Y] = 1;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ boxChoose : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
        //console.log("Sunday array is: " + state.Sun);
        //console.log("boxChoose is: " + this.state.boxChoose);
        //console.log("tableData is: " + this.state.tableData);
        break;
      case 1:
        whichDay = "MON";
        day = state.Mon;
        if(!day.includes(whichHour)) {
          day.push(whichHour);
          this.setState({ Mon: day });
          this.state.boxChoose[X][Y] = 1;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Mon : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
         console.log("Monday array is: " + state.Mon);
        break;
      case 2:
        whichDay = "TUE";
        day = state.Tues;
        if(!day.includes(whichHour)) {
          day.push(whichHour);
          this.setState({ Tues: day });
          this.state.boxChoose[X][Y] = 1;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Tue : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
        console.log("Tuesday array is: " + state.Tues);
        break;
      case 3:
        whichDay = "WED";
        day = state.Wed;
        if(!day.includes(whichHour)) {
          day.push(whichHour);
          this.setState({ Wed: day });
          this.state.boxChoose[X][Y] = 1;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Wed : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
         console.log("Wednesday array is: " + state.Wed);
        break;
      case 4:
        whichDay = "THUR";
         day = state.Thurs;
         if(!day.includes(whichHour)) {
          day.push(whichHour);
          this.setState({ Thurs: day });
          this.state.boxChoose[X][Y] = 1;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
         } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Thurs : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
         console.log("Thursday array is: " + state.Thurs);
        break;
      case 5:
        whichDay = "FRI";
         day = state.Fri;
        if(!day.includes(whichHour)) {
         day.push(whichHour);
         this.setState({ Fri: day });
         this.state.boxChoose[X][Y] = 1;
         this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
         this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Fri : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
        console.log("Friday array is: " + state.Fri);
        break;
      case 6:
        whichDay = "SAT";
         day = state.Sat;
        if(!day.includes(whichHour)) {
         day.push(whichHour);
         this.setState({ Sat: day });
         this.state.boxChoose[X][Y] = 1;
         this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
         this.forceUpdate();
        } else {
          index = day.indexOf(whichHour);
          day.splice(index, 1);
          this.setState({ Sat : day });
          this.state.boxChoose[X][Y] = 0;
          this.state.tableData[X][Y + 1] = this.button(7*X + Y, X, Y);
          this.forceUpdate();
        }
        console.log("Saturday array is: " + state.Sat);
        break;
      default: 
        whichDay = "ERR";
    }
    this.forceUpdate();
    console.log("boxChoose is: " + this.state.boxChoose);
    //Alert.alert(`Button #${value}, ${whichDay}, Hour: ${whichHour}, Coord (${X},${Y})`);
  }

  async getUserAvailability()
  {

   // const {profile, token, name, email, id} = this.state;
    const usertoken = await AsyncStorage.getItem("token");

    var userprofile = await fetch("http://104.42.79.90:2990/user/profile", {
      method: "GET",
      headers:{
        "Authorization": "Bearer " + usertoken
      }
    });

    var profilejson = await userprofile.json();
    //console.log("profilejson:", profilejson);

    this.setState({
      token: usertoken,
      oldAvailability: profilejson.schedule,
    });
  }

  saveFreeTime = () =>{
    const {token, Mon, Tues, Wed, Thurs, Fri, Sat, Sun} = this.state;
    console.log("monday ---> ", Mon);
    console.log("sunday ----> ",  Sun);
    console.log("user token" + token);
    //Call saveFreeTime API, send the user free time slots to
    //post API call with user token
    fetch("http://104.42.79.90:2990/user/editSchedule",{       
      method:"put",
        headers:{
                  "Accept": "application/json",
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + token,
                },
        body:JSON.stringify
         ({
           schedule: {
            Mon : Mon,
            Tue : Tues,
            Wed : Wed,
            Thu : Thurs,
            Fri : Fri, 
            Sat : Sat, 
            Sun : Sun,
          }
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      Toast.show(responseJson.message, Toast.LONG);
    });

    Actions.popTo("home");
}


button = (value, X, Y) => (
  <TouchableOpacity onPress={() => {this.buttonAction(value, X, Y);
                                    // if(this.state.boxChoose[X][Y])
                                    // {this.state.boxChoose[X][Y] == 0;}
                                    // else
                                    // {
                                    //   this.state.boxChoose[X][Y] == 1;
                                    // }
                                    // this.forceUpdate();
                                    }}>
    <View 
     style={this.state.boxChoose[X][Y] ? styles.greenbutton : styles.greybutton}>
      <Text style={styles.btnText}> </Text>
    </View>
  </TouchableOpacity>
);

	renderTable() {

    var half_hour = false;
    if(this.state.isRendered == false)
    {
      for (let i = 0; i < 48; i += 1) {
        const rowData = [];
        time = Math.floor(i /2);
  
        // WHOLE HOUR
        if(half_hour == false) {
          if(time <= 9) {
            rowData.push(`${0}${time}${':'}${0}${0}`);  
            for (let fill = 0; fill < 7; fill++ ) { 
              rowData.push(this.button(7*i + fill, i, fill)); 
            }
          } else {
            rowData.push(`${time}${':'}${0}${0}`);
            for (let fill = 0; fill < 7; fill++ ) { 
              rowData.push(this.button(7*i + fill, i, fill)); 
            }
          }
          half_hour = true;
  
        // HALF HOUR
        } else if(half_hour == true) {
          if(time <= 9) {
            rowData.push(`${0}${time}${':'}${3}${0}`);  
            for (let fill = 0; fill < 7; fill++ ) { 
              rowData.push(this.button(7*i + fill, i, fill)); 
            }
          } else {
            rowData.push(`${time}${':'}${3}${0}`);
            for (let fill = 0; fill < 7; fill++) { 
              rowData.push(this.button(7*i + fill, i, fill)); 
            }
          }
          half_hour = false;
        }
        this.state.tableData.push(rowData);
      }

      this.setState({ isRendered: true });
    }
  }

	render(){
    const state = this.state;
    //this.renderTable();

		return(
      <View style={{flex: 1}}>
      <NavBar style={styles}>          
            <NavButton style={styles.navButton}>
            <Image style={{width:60, height: 45}}
                resizeMode={"contain"}
              />
            </NavButton>
          <NavTitle style={styles.title}>
          {"Settings"}
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

  button: { 
    width: 49, 
    height: 39, 
    marginLeft: 0, 
    backgroundColor: '#c8e1ff', 
    borderRadius: 0 
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

  greybutton: { 
    width: 49, 
    height: 39, 
    marginLeft: 0, 
    backgroundColor: '#808080', 
    //backgroundColor: '#000000', 
    borderRadius: 0 
  },

  greenbutton: { 
    width: 49, 
    height: 39, 
    marginLeft: 0, 
    backgroundColor: '#D3FFCE', 
    borderRadius: 0 
  },
  
});