import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SocketIoClient from 'socket.io-client';
import firebase from './firebase';

import GameBoard from './components/GameBoard';
import Nav from './components/Nav';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TableMenu from './components/TableMenu';

import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      timestamp: 'current time...'
    }

    this.socket = SocketIoClient('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('connected with server!');
      this.socket.emit('subscribeToTimer', 1000);
      this.socket.on('timer', timestamp=>this.setState({timestamp:timestamp}));
    })
    let socket = this.socket;

  }

  componentDidMount(){
    console.log(firebase.auth().currentUser);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Caps</h1>
        </header>
        <Router>
          <div>
            <Nav />
            <Route exact path="/" render={socket => <TableMenu socket={this.socket} />}/>
            <Route path="/gameboard/:table_id" component={GameBoard}/>
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
          </div>
        </Router>
        <p>timer event: {this.state.timestamp}</p>
      </div>
    );
  }
}

export default App;
