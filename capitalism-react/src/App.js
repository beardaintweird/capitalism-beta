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
      id: -1,
      tables:[],
      hand:[],
      table_id: -1,
      username: '',
      isLoggedIn: false,
    }

    this.socket = SocketIoClient('http://localhost:3000');
    this.socket.on('connect', (id) => {
      console.log('connected with server!');
    })
    let socket = this.socket;

    this.joinRoom                = this.joinRoom.bind(this);
    this.updateTables            = this.updateTables.bind(this);
    this.updateTableId           = this.updateTableId.bind(this);
    this.updateLogInStatus       = this.updateLogInStatus.bind(this);
    this.updateAfterLeavingTable = this.updateAfterLeavingTable.bind(this);
  }

  componentDidMount(){
    this.updateTables()
    auth.onAuthStateChanged((user) => {
      if(user){
        let userInfo = api.getUser(auth.currentUser.email).then((userInfo) => {
          this.setState({
            isLoggedIn: true,
            id: userInfo[0].id,
            table_id: userInfo[0].table_id,
            username: userInfo[0].username,
            hand: userInfo[0].hand
          })
        })

      } else {
        this.setState({
          id:-1,
          username: '',
          table_id: -1,
          isLoggedIn:false
        })
      }
    })
  }

  joinRoom(table_id){
    if(table_id < 0) return;
    console.log('joining table:', table_id);
    this.socket.emit('joinTable', table_id)
  }
  updateLogInStatus(){
    if(firebase.auth().currentUser){
      console.log('setting logged in');
      this.setState({isLoggedIn: true})
    }
  }
  // after player joins the table
  updateTableId(table_id){
    console.log('after player joins',table_id);
    this.setState({table_id: table_id})
    this.updateTables()
  }
  updateAfterLeavingTable(){
    this.setState({
      table_id: -1
    })
    this.updateTables()
  }
  updateTables(id){
    fetch('http://localhost:3000/table')
    .then(res=>res.json())
    .then(result => {
      this.setState({
        tables: result,
        table_id: id ? id : this.state.table_id
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
              <Nav
                isLoggedIn={this.state.isLoggedIn}
                id={this.state.id}
                table_id={this.state.table_id}
                username={this.state.username}
                updateAfterLeavingTable={this.updateAfterLeavingTable} />
            <Route exact path="/"
              render={(socket, joinRoom) =>{
                return(
                  <TableMenu
                    id={this.state.id}
                    socket={this.socket}
                    joinRoom={this.joinRoom}
                    tables={this.state.tables}
                    username={this.state.username}
                    updateTables={this.updateTables}
                    isLoggedIn={this.state.isLoggedIn}
                    updateTableId={this.updateTableId}
                    playerTableId={this.state.table_id}/>
                )
                }
              }/>
            <Route path="/gameboard/:table_id"
              render={
                (socket, joinRoom) => {
                  return (
                    <GameBoard
                      socket={this.socket}
                      hand={this.state.hand}
                      joinRoom={this.joinRoom}
                      table_id={this.state.table_id}
                      username={this.state.username}
                       />
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
