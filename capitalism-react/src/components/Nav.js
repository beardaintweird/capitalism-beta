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

     }
   }
   logout(e){
     firebase.auth().signOut();
     localStorage.removeItem('user');
   }
   leaveTable(){
     const options = {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         player_id: 1,
         table_id: null
       })
     }
     // fetch()
   }
   render() {
     return (
       <nav>
        <NavLink exact onClick={this.handleClick} to="/">Tables</NavLink>&nbsp;
        {firebase.auth().currentUser ?
          <NavLink onClick={this.logout} to="/login">Logout</NavLink>
          : <NavLink onClick={this.handleClick} to="/login">Login</NavLink>

        }
       </nav>
     )
   }
 }

 export default Nav
