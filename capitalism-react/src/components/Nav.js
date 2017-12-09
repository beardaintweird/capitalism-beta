import React, {Component} from 'react';
 import './Nav.css';

 import { NavLink } from 'react-router-dom';

 class Nav extends Component {
   constructor(props){
     super(props);
     this.state = {}
   }
   componentDidMount(){

   }
   render() {
     return (
       <nav>
        <NavLink to="/gameboard">Gameboard</NavLink> &nbsp;
        <NavLink exact to="/">Tables</NavLink>
       </nav>
     )
   }
 }

 export default Nav
