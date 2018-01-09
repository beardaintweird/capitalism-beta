import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SocketIoClient from 'socket.io-client';
import firebase from './firebase';

import { getUser, objectKeys } from './api';

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
    this.socket.on('connect', (id) => {
      console.log('connected with server!');
    })
    let socket = this.socket;
    this.joinRoom = this.joinRoom.bind(this)
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        getUser(user.email);
      } else {
        let keys = objectKeys();
        for(let key in keys){
          localStorage.removeItem(key);
        }
      }
    })
  }
  joinRoom(table_id){
    console.log('joining table:', table_id);
    this.socket.emit('joinTable', table_id)
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
            <Route exact path="/"
              render={(socket, joinRoom) =>{
                return(
                  <TableMenu socket={this.socket} joinRoom={this.joinRoom} />
                )
                }
              }/>
            <Route path="/gameboard/:table_id"
              render={
                (socket, joinRoom) => {
                  return (
                    <GameBoard socket={this.socket} joinRoom={this.joinRoom} />
                  )
              }
            }/>
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
