import React, {Component} from 'react';
import Drawer from 'react-native-drawer';
import Settings from './Views/SettingsView';
import {Actions, DefaultRenderer} from 'react-native-router-flux';

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={()=>Actions.refresh({key:state.key, open: true})}
        onClose={()=>Actions.refresh({key:state.key, open: false})}
        type="displace"
        content={<Settings />}
        tapToClose={true}
        openDrawerOffset={0.1}
        panCloseMask={0.2}
        negotiatePan={true}
        tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
            })}>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate}/>
      </Drawer>
    );
  }
}
