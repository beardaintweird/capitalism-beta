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
     window.alert('You\'re game is in progress. Lost your desire to be president?')
     // if(window.confirm('Leaving the game board means')){
     //   this.leaveTable()
     // }
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
   let links;
   if(this.props.isLoggedIn){
     links = (<div><NavLink exact onClick={this.handleClick} to="/">Tables</NavLink>
              <NavLink onClick={this.logout} to="/login">Logout</NavLink></div>)
   } else {
     links = (<NavLink onClick={this.handleClick} to="/login">Login</NavLink>)
   }
   return (
     <nav>
      <div className="left"><NavLink exact to="/">Capitalism</NavLink></div>
       <div className="right">
        {links}
       </div>
     </nav>
   )
 }
}

export default Nav
