import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SocketIoClient from 'socket.io-client';

import GameBoard from './components/GameBoard';
import Nav from './components/Nav';
import TableMenu from './components/TableMenu';

import {
  BrowserRouter as Router,
  Route
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
    let socket = this.socket
  }

  componentDidMount(){

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
          </div>
        </Router>
        <p>timer event: {this.state.timestamp}</p>
      </div>
    );
  }
}

export default App;
