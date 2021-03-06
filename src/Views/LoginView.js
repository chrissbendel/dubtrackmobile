import React, {Component} from 'react';
import EventEmitter from "react-native-eventemitter";
import {
  Text,
  Dimensions,
  AsyncStorage,
  AlertIOS
} from 'react-native';

import {Container, Body, Button, Content, Form, Item, Input} from 'native-base';
import app from '../app';


//TODO: Component still needs social media signin options
export default class Login extends Component {
  constructor(props) {
    super(props);

    EventEmitter.on('loginError', (e) => {
      AlertIOS.alert(e);
    });

    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    return(
      <Container>
        <Content>
          <Body style={styles.Body}>
            <Form style={styles.Form}>
              <Item style={styles.Box}>
                <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType='done'
                returnKeyLabel='done'
                onChangeText={(username) => this.setState({username})}
                style={styles.pholder}
                placeholder="Username" />
              </Item>
              <Item last style={styles.Box}>
                <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType='done'
                returnKeyLabel='done'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
                style={styles.pholder}
                placeholder="Password" />
              </Item>
              <Button block bordered onPress={() => {
                this.props.loading();
                app.user.login(this.state.username, this.state.password).then(() => {
                  this.props.auth();
                });
                }}>
                <Text>Login</Text>
              </Button>
            </Form>
          </Body>
        </Content>
      </Container>
    );
  }
}
const {height, width} = Dimensions.get('window');
const styles = {
  Body: {
    flex: 1,
    marginTop: height/4,
    // height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Form: {
    width: 200
  },

  Box: {
    // justifyContent: 'center',
    alignItems: 'center',
  },

  Name: {
    fontWeight: 'bold',
    // justifyContent: 'center',
    // textAlign: 'center'
  },

  pholder: {
    textAlign: 'center'

  },
};
