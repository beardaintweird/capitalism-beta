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
      table_id: null,
      players: []
    }
  }
  componentDidMount(){
    let table_id = window.location.href.match(/d\/\d+$/)[0];
    table_id = table_id.substring(2)
    this.setState({table_id})
    fetch(`http://localhost:3000/table/${table_id}`)
    .then(res=>res.json())
    .then((result) => {
      console.log(result);
      this.setState({players: result.players})
    })
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.players.map((playerName) => {
            return (<Player key={playerName} username={playerName} />)
          })}
        </div>
        <div className="row"><Pile /></div>
        <div className="row"><Hand /></div>
      </div>
    )
  }
}

export default GameBoard
