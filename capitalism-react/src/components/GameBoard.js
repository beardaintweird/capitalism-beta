import React, {Component} from 'react';
import './GameBoard.css';

import Hand from './Hand';
import Pile from './Pile';
import Player from './Player';

class GameBoard extends Component {
  constructor(props){
    super(props);
    // players
    // pile
    //
    this.state = {
      table_id: 'null',
      playerNames: [],
      players: [],
      hand: [],
      this_player: {},
      game_underway: false
    }
    this.startGame = this.startGame.bind(this);

  }
  componentDidMount(){
    let table_id = window.location.href.match(/d\/\d+$/)[0];
    table_id = table_id.substring(2)
    this.setState({table_id})
    fetch(`http://localhost:3000/table/${table_id}`)
    .then(res=>res.json())
    .then((result) => {
      console.log(result);
      this.setState({playerNames: result.players})
    })
    this.props.socket.on('cards_dealt', (players) => {
      // console.log('cards dealt socket event', players);
      this.setState({players: players}, () => {
        let this_player = this.state.players.filter((player) => {
          return player.username == localStorage.getItem('username')
        })[0];
        if(this_player){
          this.setState({hand:this_player.hand})
          this.setState({this_player: this_player})
        }
      })
    })
  }
  componentDidUpdate(){

  }
  startGame(e){
    this.props.socket.emit('startGame', this.state.playerNames, this.state.table_id)
    this.setState({game_underway: true})

  }
  render() {
    if(this.state.table_id !== 'null'){
      this.props.joinRoom(this.state.table_id)
    }
    return (
      <div className="container">
        <div className="row">
          {this.state.playerNames.map((playerName) => {
            return (<Player key={playerName} username={playerName} />)
          })}
        </div>
        <div className="row"><Pile /></div>
        <div className="row"><Hand data={this.state.hand} isTurn={this.state.this_player.isTurn}/></div>
        <div className="row">
          {
            this.state.playerNames.length >= 4 && !this.state.game_underway ?
            <button onClick={this.startGame}>Start Game</button>
            : <button onClick={this.startGame} disabled>Start Game</button>
          }
        </div>
      </div>
    )
  }
}

export default GameBoard
