import React, {Component} from 'react';
import './Nav.css';
import { NavLink } from 'react-router-dom';

import firebase from './../firebase';

class Nav extends Component {
 constructor(props){
   super(props);
   this.state = {}
   this.handleClick = this.handleClick.bind(this)
   this.leaveTable = this.leaveTable.bind(this)
   this.logout = this.logout.bind(this)
 }
 componentDidMount(){

 }
 handleClick(e){
   // console.log(window.location.href.match(/gameboard/gim));
   if(window.location.href.match(/gameboard/gim)){
     this.leaveTable();
   }
 }
 logout(e){
   firebase.auth().signOut();
 }
 leaveTable(){
   const options = {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       player_id: this.props.id,
       table_id: this.props.table_id,
       username: this.props.username
     })
   }
   fetch('http://localhost:3000/table/leave', options)
   .then(res=>res.json())
   .then((result) => {
     // returns [1] or [0]
     console.log('result from table leave', result);
     if(result[0]===1)
      this.props.updateAfterLeavingTable();
   })
 }
 render() {
   return (
     <nav>
      {this.props.isLoggedIn ?
        <div>
          <NavLink exact onClick={this.handleClick} to="/">Tables</NavLink>&nbsp;
          <NavLink onClick={this.logout} to="/login">Logout</NavLink>
        </div>
        : <NavLink onClick={this.handleClick} to="/login">Login</NavLink>

      }
     </nav>
   )
 }
}

export default Nav
