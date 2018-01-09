import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SocketIoClient from 'socket.io-client';
import firebase, {auth} from './firebase';

import * as api from './api';

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
      timestamp: 'current time...',
      isLoggedIn: false,
      user: null
    }

    this.socket = SocketIoClient('http://localhost:3000');
    this.socket.on('connect', (id) => {
      console.log('connected with server!');
    })
    let socket = this.socket;
    this.joinRoom             = this.joinRoom.bind(this);
    this.updateLogInStatus = this.updateLogInStatus.bind(this);
  }

  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      if(user){
        api.getUser();
        this.setState({isLoggedIn: true})
      } else {
        let keys = api.objectKeys();
        for(let key in keys){
          localStorage.removeItem(key);
        }
        this.setState({isLoggedIn:false})
      }
    })
  }
  joinRoom(table_id){
    console.log('joining table:', table_id);
    this.socket.emit('joinTable', table_id)
  }
  updateLogInStatus(){
    if(firebase.auth().currentUser){
      console.log('setting logged in');
      this.setState({isLoggedIn: true})
    } else {

    }
    console.log(firebase.auth().currentUser);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Caps</h1>
          {this.state.isLoggedIn ? <p>You are logged in.</p> : <p>UH, LOG IN!</p>}
        </header>
        <Router>
          <div>
            <Nav isLoggedIn={this.state.isLoggedIn} />
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
            <Route path="/login" render={
              (setLoggedIn) => {
                return (<SignIn />)
              }
            } />
            <Route path="/signup" render={
              (setLoggedIn) => {
                return(<SignUp />)
              }
            } />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
