import EventEmitter from "react-native-eventemitter";
import {AsyncStorage} from 'react-native';
import User from './user/user';
import Room from './room/room';
import roles from './user/roles';
import socket from './socket';
const base = 'https://api.dubtrack.fm/';

export default class api {
  constructor() {

    this.currentRoom = null;
  }

  /******************/
  /* USER API CALLS */
  /******************/

  logout = function () {
    return fetch(base + 'auth/logout')
      .then(() => {
        AsyncStorage.removeItem('user').then(() => {
          EventEmitter.emit('userAuth', null);
          console.log('Logged out');
        });
      })
  };

  login = function (username, password) {
    let login = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify({
        'username': username,
        'password': password
      }),
    };

    return fetch(base + 'auth/dubtrack', login)
      .then(res => res.json())
      .then(res => {
        if (res.code == 200) {
          return this.getUserInfo(username).then(user => {
            EventEmitter.emit('userAuth', user._id);
            AsyncStorage.setItem('user', JSON.stringify(user)).then(() => {
              console.log('Logged in');
            });
          });
        } else {
          AsyncStorage.removeItem('user').then(() => {
            if (res.data.details.message.message) {
              EventEmitter.emit('loginError', res.data.details.message.message);
            } else {
              EventEmitter.emit('loginError', res.data.details.message);
            }
          });
        }
      })
  };

  getUserInfo = function (user) {
    return fetch(base + 'user/' + user)
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  /******************/
  /* LOBBY API CALLS */
  /******************/

  listRooms = function () {
    return fetch('https://api.dubtrack.fm/room')
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      })
  };

  filterRooms = function (q) {
    return fetch('https://api.dubtrack.fm/room/term/' + q)
      .then(res => res.json())
      .then((json) => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  /******************/
  /* ROOM API CALLS */
  /******************/

  getRoomInfo = function (room) {
    return fetch(base + 'room/' + room)
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  getRoomUsers = function (room) {
    return fetch(base + 'room/' + room + '/users')
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  chat = function (message, room, realTimeChannel) {
    let obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify({
        'message': message,
        'realTimeChannel': realTimeChannel,
        'time': Date.now(),
        'type': 'chat-message'
      })
    };

    return fetch(base + 'chat/' + room, obj)
      .catch(e => {
        console.log(e);
      });
  };

  joinRoom = function (id) {
    let obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
    };
    return fetch('https://api.dubtrack.fm/room/' + id + '/users', obj);
  };

  currentSong = function (id) {
    return fetch('https://api.dubtrack.fm/room/' + id + '/playlist/active')
      .then(res => res.json())
      .then(json => {
        return json;
      })
      .catch(e => {
        console.log(e);
      });
  };

  /******************/
  /* PRIVATE MESSAGE API CALLS */
  /******************/

  listMessages = function () {
    return fetch(base + 'message')
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  getConversation = function (id) {
    return fetch(base + 'message/' + id)
      .then(res => res.json())
      .then(json => {
        return json;
      })
      .catch(e => {
        console.log(e);
      });
  };

  markAsRead = function (id) {
    let obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      }
    };

    return fetch(base + 'message/' + id + '/read', obj);
  };

  newPM = function (usersid) {
    if (usersid.length > 10) {
      console.log("conversations are up to 10 people.");
      return;
    }

    let obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify({
        'usersid': usersid
      })
    };

    return fetch(base + 'message', obj)
      .then(res => res.json())
      .then(json => {
        console.log('json inside pm.get()');
        console.log(json);
        return json;
      })
      .catch(e => {
        console.log(e);
      });
  };

  checkNew = function () {
    return fetch(base + 'message/new')
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  };

  sendPM = function (id, message) {
    let obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify({
        'message': message,
        'time': Date.now(),
      })
    };

    return fetch(base + 'message/' + id, obj)
      .then(res => res.json())
      .then(json => {
        return json;
      })
      .catch(e => {
        console.log(e);
      });
  };
}
