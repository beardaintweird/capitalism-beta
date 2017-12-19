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
           player: localStorage.getItem('username'),
           player_id: localStorage.getItem('id')
         })
     }
     fetch('http://localhost:3000/table/addPlayer', options)
      .then(res=>res.json())
      .then((result) => {
        console.log(result);
        localStorage.setItem('table_id', this.props.table_id)
        this.props.joinRoom(this.props.table_id)
      })
     console.log('clicked join');
   }
   shouldUserJoinTable(){
     if(localStorage.getItem('id')){
       return localStorage.getItem('table_id') === 'null' ? true : false
     } else {
       return false
     }
   }
   goToGameBoard(e){
     this.props.history.push(`/gameboard/${this.props.table_id}`)
   }
   render() {
     let enabled = this.shouldUserJoinTable()
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
            {
              enabled ?
                <button onClick={this.handleClick} >Join</button>
              :
                <div>
                </div>
            }
            {
              this.props.table_id === localStorage.getItem('table_id') ?
                  <button onClick={this.goToGameBoard}>Go</button>
                  : <div></div>
            }

          </div>
        </div>
       </div>
     )
   }
 }

 export default withRouter(Table)
