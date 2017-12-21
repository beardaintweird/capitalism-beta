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
      played_cards: [],
      this_player: {},
      game_underway: false
    }
    this.pass              = this.pass.bind(this);
    this.playCard          = this.playCard.bind(this);
    this.startGame         = this.startGame.bind(this);
    this.updatePlayer      = this.updatePlayer.bind(this);
    this.updatePlayedCards = this.updatePlayedCards.bind(this);
    this.bomb              = this.bomb.bind(this);
    this.playDoubles       = this.playDoubles.bind(this);
    this.playTriples       = this.playTriples.bind(this);
    this.autoComplete      = this.autoComplete.bind(this);
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
      this.updatePlayer(players)
    })
    this.props.socket.on('pass_complete', (players) => {
      console.log('pass_complete received from server.');
      this.updatePlayer(players)
    })
    this.props.socket.on('play_card_complete', (players, played_cards) => {
      console.log('play_card_complete received from server.');
      this.updatePlayer(players)
      this.updatePlayedCards(played_cards);
    })
    this.props.socket.on('skip', () => {
      console.log('SKIEP!!');
      // add animation for skipping players here for hype
    })
    this.props.socket.on('bomb_complete', (players, played_cards) => {
      console.log('bombs away!');
      this.updatePlayer(players)
      this.updatePlayedCards(played_cards)
    })
    this.props.socket.on('play_doubles_complete', (players, played_cards) => {
      // Making separate socket event in case of future animation or other functionality
      console.log('doubles!');
      this.updatePlayer(players)
      this.updatePlayedCards(played_cards);
    })
  }
  componentDidUpdate(){

  }
  updatePlayedCards(played_cards){
    this.setState({played_cards})
  }
  updatePlayer(players){
    this.setState({players: players}, () => {
      let this_player = this.state.players.filter((player) => {
        return player.username === localStorage.getItem('username')
      })[0];
      if(this_player){
        this.setState({hand:this_player.hand})
        this.setState({this_player: this_player})
      }
    })
  }
  startGame(e){
    this.props.socket.emit('startGame', this.state.playerNames, this.state.table_id)
    this.setState({game_underway: true})
  }
  pass(e){
    console.log(`${this.state.this_player.username} passes.`);
    this.props.socket.emit('pass', this.state.players, this.state.this_player.username, this.state.table_id)
  }
  playCard(card){
    this.props.socket.emit('play_card', this.state.players, card, this.state.this_player.username, this.state.played_cards, this.state.table_id)
  }
  bomb(card){
    this.props.socket.emit('bomb', this.state.players, card, this.state.this_player.username, this.state.played_cards, this.state.table_id);
  }
  playDoubles(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    if(cards.length > 2){
      cards = cards.splice(0,2);
    }
    this.props.socket.emit('play_doubles', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.state.table_id)
  }
  playTriples(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    if(cards.length > 3){
      cards = cards.splice(0,3);
    }
    this.props.socket.emit('play_triples', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.state.table_id)
  }
  autoComplete(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    this.props.socket.emit('auto_complete', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.state.table_id)
  }
  render() {
    let topCard;
    if(this.state.table_id !== 'null'){
      this.props.joinRoom(this.state.table_id)
    }
    let players;
    if(this.state.playerNames){
      players = this.state.playerNames.map((playerName) => {
        return (<Player
                  key={playerName}
                  isTurn={this.state.this_player.isTurn}
                  username={playerName} />)
      });
    }
    if(this.state.played_cards.length){
      topCard = this.state.played_cards[this.state.played_cards.length - 1]
    } else {
      topCard = null;
    }
    return (
      <div className="container">
        <div className="row">
          {players}
        </div>
        <div className="row"><Pile cards={this.state.played_cards} /></div>
        <div className="row">
          <Hand
            data={this.state.hand}
            isTurn={this.state.this_player.isTurn}
            pass={this.pass}
            playCard={this.playCard}
            topCard={topCard}
            bomb={this.bomb}
            playDoubles={this.playDoubles}
            playTriples={this.playTriples}
            autoComplete={this.autoComplete}
            />
        </div>
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
