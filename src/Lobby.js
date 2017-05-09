import React, {Component} from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Navigator,
  TextInput,
  ScrollView,
  RefreshControl
} from 'react-native';

import GridView from 'react-native-grid-view'

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import app from './app';
import Nav from './Views/Nav';
import {Actions} from 'react-native-router-flux'
import {
  Container,
  Header,
  Item,
  Input,
  Body,
  List,
  ListItem,
  Thumbnail,
  Button,
  Icon,
  Content
} from 'native-base';

let {height, width} = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.query = '';
    this.state = {
      dataSource: [],
      refreshing: false,
    };
  }

  componentWillMount() {
    this.listRooms();
  }

  searchRooms(room) {

  }

  listRooms(room = null) {
    if (room) {
      app.user.filterRooms(room)
        .then(rooms => {
          this.setState({
            dataSource: rooms,
            // dataSource: this.state.dataSource.cloneWithRows(rooms),
            refreshing: false
          })
        });
    } else {
      app.user.listRooms()
        .then(rooms => {
          this.setState({
            // dataSource: this.state.dataSource.cloneWithRows(rooms),
            dataSource: rooms,
            refreshing: false
          })
        });
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.listRooms();
  }

  pressRow(rowData) {
    return app.user.joinRoom(rowData._id).then(() => {
      Actions.room({room: rowData});
    });
  }

  renderRow(rowData) {
    let uri = 'https://res.cloudinary.com/hhberclba/image/upload/c_fill,fl_lossy,f_auto,w_320,h_180/default.png';

    return (
      <ListItem onPress={() => this.pressRow(rowData)}>
        <Thumbnail size={80} source={{uri: rowData.background ? rowData.background.secure_url : uri}}/>
        <Body>
        <Text style={styles.rowTitle}>{rowData.name}</Text>
        <Text style={styles.rowInfo}>{rowData.activeUsers} current users</Text>
        <Text
          style={styles.rowInfo}>{rowData.currentSong ? rowData.currentSong.name : 'No one is playing right now!'}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    return (
      <Container style={{marginTop: 54}}>
        <Header searchBar rounded>
          <Item>
            <Icon name="search"/>
            <Input
              ref={'search'}
              placeholder='Search'
              placeholderTextColor={'black'}
              returnKeyType="search"
              returnKeyLabel="search"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={search => this.query = search}
              onSubmitEditing={this.listRooms(this.query)}/>
          </Item>
          <Button iconLeft transparent onPress={() => {
            alert('new room')
          }}>
            <Icon name="add"/>
            <Text>Create Room</Text>
          </Button>
        </Header>
        <List
          dataArray={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }/>
        <Nav/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  rowTitle: {
    color: '#333333',
    fontSize: 16,
    textAlign: 'center',
  },
  rowInfo: {
    color: '#333333',
    fontSize: 12,
    textAlign: 'center',
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    justifyContent: 'center',
    padding: 10,
    margin: 6,
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
});
