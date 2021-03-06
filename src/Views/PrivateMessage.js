import React, {Component} from 'react';
import EventEmitter from "react-native-eventemitter";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import {
  Container,
  Header,
  Content,
} from 'native-base';

import app from '../app';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {Actions} from 'react-native-router-flux';
import FullSpinner from './FullSpinnerView';

export default class PrivateMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      mounted: false,
    };
    this.onSend = this.onSend.bind(this);

    EventEmitter.on('pm', () => {
      if (this.state.mounted) {
        this.getMessages();
      } else {
        console.log('got message but unmounted');
      }
    });
  }

  componentWillMount() {
    this.getMessages();
    this.setState({mounted: true});
  }

  componentWillUnmount() {
    this.setState({mounted: false});
  }

  getMessages() {
    let that = this;
    AsyncStorage.getItem('user').then((user) => {
      this.setState({user: JSON.parse(user)});
    }).then(() => {
      app.user.getConversation(this.props.id)
        .then(messages => {
          that.state.messages = [];
          messages.data.forEach(function (msg) {
            let newMessage = {
              _id: msg._id,
              text: msg.message,
              createdAt: msg.created,
              user: {
                _id: msg._user._id,
                name: msg._user.username,
                avatar: msg._user.profileImage.secure_url
              }
            };
            that.setState(previousState => ({
              messages: GiftedChat.prepend(previousState.messages, newMessage)
            }));
          });
        })
    });
  }

  onSend(msg) {
    app.user.sendPM(this.props.id, msg[0].text);
  }

  renderBubble(props) {
    if (props.isSameUser(props.currentMessage, props.previousMessage) && props.isSameDay(props.currentMessage, props.previousMessage)) {
      return (
        <Bubble {...props}/>
      );
    }
    if (props.position == 'left') {
      return (
        <View>
          <Text>{props.currentMessage.user.name}</Text>
          <Bubble {...props}/>
        </View>
      );
    } else {
      return (
        <Bubble {...props}/>
      );
    }
  }

  render() {
    if (!this.state.messages.length) {
      return <FullSpinner/>
    }

    if (!this.state.user) {
      return <FullSpinner/>
    }

    return (
      <Container style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          renderBubble={this.renderBubble}
          onSend={this.onSend.bind(this)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.username,
            avatar: this.state.user.profileImage.secure_url
          }}/>
      </Container>
    );
  }
}
