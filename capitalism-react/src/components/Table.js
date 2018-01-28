import React, {Component} from 'react';
import './Table.css';

import {withRouter} from 'react-router-dom';
import {leaveTable} from './../api';

class Table extends Component {
 constructor(props){
   super(props);
   this.state = {
     // enabled: true
   }
   this.handleClick = this.handleClick.bind(this);
   this.goToGameBoard = this.goToGameBoard.bind(this);
   this.shouldUserJoinTable = this.shouldUserJoinTable.bind(this);
 }
 componentDidMount(){

 }
 handleClick(e){
   const options = {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(
       {
         table_id: this.props.table_id,
         player: this.props.username,
         player_id: this.props.id
       })
   }
   fetch('http://localhost:3000/table/addPlayer', options)
    .then(res=>res.json())
    .then((result) => {
      console.log(result);
      //should update app's table_id here
      this.props.updateTableId(this.props.table_id)
      this.props.joinRoom(this.props.table_id)
    })
   console.log('clicked join');
 }
 handleLeaveTable = ()=>{
   leaveTable(this.props.id,this.props.table_id)
    .then(res=>{
      this.props.updateTableId(-1)
    })
 }
 shouldUserJoinTable(){
   return this.props.isLoggedIn && this.props.playerTableId === -1
 }
 goToGameBoard(e){
   this.props.history.push(`/gameboard/${this.props.table_id}`)
 }
 render() {
   let enabled    = this.shouldUserJoinTable();
   let joinButton = this.props.playerTableId < 0 ? (<button onClick={this.handleClick} >Join</button>) : '';
   let goButton   = this.props.table_id === this.props.playerTableId
    ? (<div>
        <button onClick={this.goToGameBoard}>Go</button>
        <br/><br/>
        <button onClick={this.handleLeaveTable}>Leave</button>
      </div>) : '';
   return (
     <div className="col s3">
      <div className="card white">
        <div className="card-content black-text">
          <span className="card-title">{this.props.table_name}</span>
          <ul>
            {this.props.players ? this.props.players.map((player) => {
              return (<li key={player}>{player}</li>)
            }) : 'no players'
          }
          </ul>
          {joinButton}
          {goButton}
        </div>
      </div>
     </div>
   )
 }
}

export default withRouter(Table)
