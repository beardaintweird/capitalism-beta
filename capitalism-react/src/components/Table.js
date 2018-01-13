import React, {Component} from 'react';
 import './Table.css';

 import {withRouter} from 'react-router-dom';

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
   shouldUserJoinTable(){
     return this.props.isLoggedIn && !this.props.playerTableId
   }
   goToGameBoard(e){
     this.props.history.push(`/gameboard/${this.props.table_id}`)
   }
   render() {
     let enabled    = this.shouldUserJoinTable();
     let joinButton = enabled ? (<button onClick={this.handleClick} >Join</button>) : '';
     let goButton   = this.props.table_id === this.props.playerTableId
      ? (<button onClick={this.goToGameBoard}>Go</button>) : '';
     return (
       <div className="col s3">
        <div className="card white">
          <div className="card-content black-text">
            <span className="card-title">{this.props.table_name}</span>
            <ul>
              {this.props.players ? this.props.players.map((player) => {
                return (<li key={player.id}>{player.username}</li>)
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
