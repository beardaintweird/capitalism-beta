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
  }
  componentDidMount(){

  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s3"><Player /></div>
          <div className="col s3"><Player /></div>
          <div className="col s3"><Player /></div>
          <div className="col s3"><Player /></div>
        </div>
        <div className="row"><Pile /></div>
        <div className="row"><Hand /></div>
      </div>
    )
  }
}

export default GameBoard
