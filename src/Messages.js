import React, {Component} from 'react';

import {
  Container,
  Content,
  Thumbnail,
  List,
  ListItem,
  Header,
  Body,
  Title,
  Text,
  Left,
  Right,
} from 'native-base';

import {Actions} from 'react-native-router-flux'

import app from './app';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: []
    };
  }

  componentWillMount() {
    app.user.listMessages()
      .then(messages => {
        this.setState({
          conversations: messages,
        })
      })
  }

  renderRow(item) {
    console.log(item);
    return (
      <ListItem thumbnail button onPress={() => {
        app.user.markAsRead(item._id);
        Actions.pm({id: item._id, title: item.usersid[0].username});
      }}>
        <Left>
          <Thumbnail size={60} source={{uri: item.usersid[0].profileImage.secure_url}}/>
        </Left>
        <Body>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.usersid[0].username}</Text>
        <Text note>{item.latest_message_str}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          <List
            dataArray={this.state.conversations}
            renderRow={this.renderRow.bind(this)}/>
        </Content>
      </Container>

    );
  }
}
