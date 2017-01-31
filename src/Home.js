GLOBAL = require('../src/Globals');

import React, {Component} from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
  Navigator,
  Button,
  TextInput,
  RefreshControl,
  Menu
} from 'react-native';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import app from './app';
import {Actions} from 'react-native-router-flux'

import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Home extends Component {
  constructor(props) {
    super(props);
    console.log(app.user);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      roomSearch: '',
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
    };
    app.user.login('dubtrackmobile', 'insecure');
    this.loadData();
  }

  loadData(room) {
    if (room) {
      return fetch('https://api.dubtrack.fm/room/term/' + room)
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(json.data)
          });
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      return fetch('https://api.dubtrack.fm/room')
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(json.data),
            refreshing: false,
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.loadData();
  }


  //use command+shift+k to enable keyboard hardware on ios emulator to test search bar
  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
        <TextInput
          style={styles.searchBar}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Search for a room"
          returnKeyType='search'
          returnKeyLabel='search'
          onChangeText={(roomSearch) => this.setState({roomSearch})}
          onSubmitEditing={() => {
            this.loadData(this.state.roomSearch)
          }}/>
        <KeyboardSpacer/>
      </View>
    );
  }

  renderRow(rowData) {
    let {height, width} = Dimensions.get('window');
    let uri;

    if (rowData.background) {
      uri = rowData.background.secure_url;
    } else {
      uri = 'https://res.cloudinary.com/hhberclba/image/upload/c_fill,fl_lossy,f_auto,w_320,h_180/default.png';
    }
    return (
      <Card>
        <CardImage>
          <TouchableHighlight onPress={ () => this.pressRow(rowData)}>
            <Image
              style={{width: width, height: 150}}
              source={{uri: uri}}
            />
          </TouchableHighlight>
        </CardImage>
        <CardTitle>
          <Text style={styles.rowTitle}> {rowData.name} </Text>
        </CardTitle>
      </Card>
    );
  }

  pressRow(rowData) {
    console.log(app.user.room);
    let currentRoom = app.user.room;
    let roomToJoin = rowData._id;

    if (currentRoom) {
      if (currentRoom.info._id == roomToJoin) {
        Actions.room({room: rowData});
        return;
      } else {
        app.user.leaveRoom(currentRoom.info._id);
        app.user.joinRoom(roomToJoin);
        Actions.room({room: rowData});
        return;
      }
    } else {
      app.user.joinRoom(roomToJoin);
      Actions.room({room: rowData});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
  },
  roomList: {
    marginTop: 30,
  },
  searchBar: {
    height: 30,
    borderColor: 'black',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    margin: 10,
  },
  rowContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowTitle: {
    color: '#333333',
    fontSize: 18,
  },
});
