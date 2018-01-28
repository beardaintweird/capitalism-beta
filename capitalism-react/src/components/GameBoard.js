import React, {Component} from 'react';
import './GameBoard.css';
import { updateGameUnderway, getUser, getTablePlayers } from '../api';

import Hand from './Hand';
import Player from './Player';
import Completion from './Completion';
import PlayedCards from './PlayedCards';
import PileSelection from './PileSelection';

class GameBoard extends Component {
  constructor(props){
    super(props);
    // players
    // pile
    //
    this.state = {
      hand: [],
      piles: [],
      timer: -1,
      players: [],
      this_player: {},
      playerNames: [],
      played_cards: [],
      game_underway: false,
      isDoublesOnly: false,
      isTriplesOnly: false,
      playerJoinedTable: false
    }
    this.bomb                = this.bomb.bind(this);
    this.pass                = this.pass.bind(this);
    this.playCard            = this.playCard.bind(this);
    this.startGame           = this.startGame.bind(this);
    this.selectPile          = this.selectPile.bind(this);
    this.playDoubles         = this.playDoubles.bind(this);
    this.playTriples         = this.playTriples.bind(this);
    this.updatePlayer        = this.updatePlayer.bind(this);
    this.autoComplete        = this.autoComplete.bind(this);
    this.playCompletion      = this.playCompletion.bind(this);
    this.updatePlayedCards   = this.updatePlayedCards.bind(this);
    this.checkForCompletions = this.checkForCompletions.bind(this);

  }
  componentDidMount(){
    /*
    ==================================================
    GAME ADMINISTRATION FUNCTIONALITY
    ==================================================
    */
    this.props.socket.on('table_joined', () => {
      console.log('You have joined the table.')
      if(this.state.players.length < 4){
        getTablePlayers(this.props.table_id)
          .then((table) => {
            this.setState({
              players: table.players
            })
          })
      }
      this.setState({playerJoinedTable: true})
    })
    this.props.socket.on('cards_dealt', (players) => {
      this.updatePlayer(players);
      this.setState({'game_underway': true})
    })
    this.props.socket.on('start_pile_selection', (players, piles) => {
      this.updatePlayer(players);
      this.setState({piles});
    })
    this.props.socket.on('pile_selected', (players,allPiles,game_underway) => {
      this.updatePlayer(players,()=>this.setState({
        piles: allPiles,
        game_underway: game_underway
      }))
    })
    this.props.socket.on('game_ended', (players) => {
      this.updatePlayer(players)
      this.setState({
        game_underway: false,
        played_cards: []
      })
    })
    /*
    ==================================================
    GAMEPLAY FUNCTIONALITY
    ==================================================
    */
    this.props.socket.on('timer_update', (newTime, player) => {
      if(this.state.this_player.username === player.username)
        this.setState({timer: newTime}, () => {
          if(this.state.timer === -1){
            this.pass();
          }
        })
    })
    this.props.socket.on('pass_complete', (players, played_cards) => {
      console.log('pass_complete received from server.');
      this.updatePlayer(players, this.updatePlayedCards(played_cards))
    })
    this.props.socket.on('play_card_complete', (players, played_cards) => {
      console.log('play_card_complete received from server. ');
      this.updatePlayer(players,this.updatePlayedCards(played_cards))
    })
    this.props.socket.on('skip', () => {
      console.log('SKIEP!!');
      // add animation for skipping players here for hype
    })
    this.props.socket.on('bomb_complete', (players) => {
      console.log('bombs away!');
      this.updatePlayer(players)
    })
    this.props.socket.on('play_doubles_complete', (players, played_cards) => {
      // Making separate socket event in case of future animation or other functionality
      console.log('doubles!');
      this.setState({
        isDoublesOnly: true
      }, () => {
        this.updatePlayer(players,this.updatePlayedCards(played_cards))
        })
    })
    this.props.socket.on('play_triples_complete', (players, played_cards) => {
      // Making separate socket event in case of future animation or other functionality
      console.log('triples!!');
      this.updatePlayer(players, this.updatePlayedCards(played_cards))
      this.setState({
        isTriplesOnly: true
      })
    })
    this.props.socket.on('play_auto_complete', (players, played_cards) => {
      // Making separate socket event in case of future animation or other functionality
      console.log('Auto complete! ');
      this.updatePlayer(players)
      this.updatePlayedCards(played_cards, true);
    })
    this.props.socket.on('completion_complete', (players) => {
      this.updatePlayer(players)
    })
    this.props.socket.on('game_finished', () => {
      this.setState({game_underway: false})
      console.log('Game finished!!');
      if(this.state.this_player.isTurn)
        this.props.socket.emit('start_next_game', this.state.players, this.props.table_id)
    })
    this.props.socket.on('clear', () => {
      this.setState({
        played_cards: [],
        isDoublesOnly: false,
        isTriplesOnly: false
      })
    })
  }
  componentDidUpdate(){
    if(this.props.table_id > 0 && !this.state.players.length){
      getTablePlayers(this.props.table_id)
        .then(table=>{
          table.players = table.players.map(player=>{
            player.hand = JSON.parse(player.hand)
            return player
          })
          console.log(table);
          this.updatePlayer(table.players)
          if(table.playedCards)
            this.updatePlayedCards(JSON.parse(table.playedCards),false)
            this.updateTableValues(table.isDoublesOnly,table.isTriplesOnly, table.game_underway)
        })
    }
  }
  updateTableValues = (bool1,bool2,bool3) => {
    this.setState({
      isDoublesOnly: bool1,
      isTriplesOnly: bool2,
      game_underway: bool3
    })
  }
  updatePlayedCards(played_cards, autoComplete){
    this.setState({played_cards}, () => {
      if(!autoComplete && !this.state.this_player.isDone)
        this.checkForCompletions();
    })
  }
  updatePlayer(players, callback){
    let playerNames = []
    let this_player = players.filter((player) => {
      playerNames.push(player.username)
      return player.username === this.props.username
    })[0];
    console.log(this_player.timer, players);
    if(!this.state.playerNames.length){
      this.setState({
        players: players,
        this_player:this_player,
        hand: this_player.hand,
        playerNames: playerNames,
        timer: this_player.timer
      }, () => {
        // when a player refreshes
        if(this.state.this_player.isTurn && this.state.game_underway){
          this.props.socket.emit('resume_timer', this.state.players, this.state.this_player, this.props.table_id)
        }
        if(this.state.game_underway && this.state.hand && this.state.hand.cards.length === 0)
          console.log('Done!');
      })
    } else {
      // normal update
      this.setState({
        players: players,
        this_player:this_player,
        hand: this_player.hand
      }, () => {
        console.log(this.state.this_player.isTurn, this.state.game_underway);
        if(this.state.this_player.isTurn && this.state.game_underway){
          this.props.socket.emit('resume_timer', this.state.players, this.state.this_player, this.props.table_id)
        }
        if(this.state.game_underway && this.state.hand && this.state.hand.cards.length === 0)
          console.log('Done! ');
      })
    }
  }
  startGame(e){
    let players = this.state.players.length ? this.state.players : this.state.playerNames
    this.props.socket.emit('startGame', players, this.props.table_id)
    this.setState({game_underway: true})
    updateGameUnderway(this.props.table_id, true);
  }
  endGame = ()=>{
    // end game
    this.props.socket.emit('end_game', this.state.players, this.props.table_id)
  }
  selectPile(pile, allPiles){
    this.props.socket.emit('select_pile', this.state.players, this.state.this_player.username, pile, allPiles, this.props.table_id)
  }
  pass(e){
    console.log(`${this.state.this_player.username} passes `);
    this.props.socket.emit('pass', this.state.players, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  playCard(card){
    card.username = this.state.this_player.username;
    this.props.socket.emit('play_card', this.state.players, card, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  bomb(card){
    this.props.socket.emit('bomb', this.state.players, card, this.state.this_player.username, this.state.played_cards, this.props.table_id);
  }
  playDoubles(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    if(cards.length > 2){
      cards = cards.splice(0,2);
    }
    this.props.socket.emit('play_doubles', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  playTriples(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    if(cards.length > 3){
      cards = cards.splice(0,3);
    }
    this.props.socket.emit('play_triples', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  autoComplete(title){
    let cards = this.state.hand.cards.filter((card) => {
      return card.title === title;
    });
    this.props.socket.emit('auto_complete', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  playCompletion(cards){
    this.props.socket.emit('play_completion', this.state.players, cards, this.state.this_player.username, this.state.played_cards, this.props.table_id)
  }
  checkForCompletions(){
    if(!this.state.played_cards.length || !this.state.hand){
      return null;
    }
    let length = this.state.played_cards.length;
    let topCard = this.state.played_cards[length - 1];
    let potentialCompletion = [topCard]
    let count = 2;
    // gets the cards in the pile of the same rank
    while(length - count >= 0
    &&
    topCard.rank === this.state.played_cards[length - count].rank){
      potentialCompletion.push(this.state.played_cards[length - count]);
      count++;
    }
    // check for completion in the user's hand
    let userCompletion = this.state.hand.cards.filter((card) => {
      return card.rank === potentialCompletion[0].rank
    })
    //(BUG FIX): first condition to prevent autocompletion passing this condition
    if(userCompletion.length && userCompletion.length + potentialCompletion.length === 4){
      return userCompletion;
    } else {
      return false;
    }
  }
  render() {
    let timer;
    let topCard;
    let players;
    let completion;
    let pileSelection;
    let gameButton;
    let needMorePlayersMessage;

    // start the timer
    if(this.state.this_player.isTurn){
      if(this.state.timer > 0)
        timer = (<p className="timer">{this.state.timer}</p>)
    } else {
      timer = (<p>Not your turn</p>)
    }

    // joining the socket room if not already joined
    if(!this.state.playerJoinedTable && this.props.table_id !== 'null'){
      this.props.joinRoom(this.props.table_id)
    }

    // making the players
    if(this.state.players.length){
      players = this.state.players.map((player) => {
        let prevRanking = player.previousRanking ? player.previousRanking : '';
        return (<Player
                  key={player.username}
                  isTurn={player.isTurn}
                  previousRanking={prevRanking}
                  ranking={player.ranking}
                  username={player.username}
                  />)
      })
    }

    // updating the topCard
    if(this.state.played_cards.length)
      topCard = this.state.played_cards[this.state.played_cards.length - 1]
    else
      topCard = null;

    // needs performance upgrade
    if(!this.state.this_player.isDone && this.checkForCompletions()){
      let completionArray = this.checkForCompletions()
      completion = (<Completion
        title={completionArray[0].title}
        data={completionArray}
        playCompletion={this.playCompletion}
        enabled={true}/>)
    } else {
      completion = (<Completion enabled={false} />)
    }

    // for the start button or how many players needed message
    if(this.state.playerNames[0] === this.props.username
      && !this.state.game_underway
      && this.state.players.length > 3
    ){
      gameButton = (<button onClick={this.startGame}>Start Game</button>)
    } else if(!this.state.game_underway) {
      needMorePlayersMessage = (<p>Need {4 - this.state.players.length} more player(s) to start the game...</p>)
    } else if (this.state.game_underway){
      gameButton = (<button onClick={this.endGame}>End Game</button>)
    }

    // for piles when the first round is over
    if(this.state.piles.length && !this.state.game_underway){
      pileSelection = (
        <PileSelection
          selectPile={this.selectPile}
          piles={this.state.piles}
          isTurn={this.state.this_player.isTurn}/>)
    }
    return (
      <div className="container">
        <div className="row">
          {players}
          {timer}
        </div>
        <div className="row"><PlayedCards cards={this.state.played_cards} /></div>
        {pileSelection}
        <div className="row">
          <Hand
            hand={this.state.hand}
            isTurn={this.state.this_player.isTurn}
            pass={this.pass}
            playCard={this.playCard}
            topCard={topCard}
            bomb={this.bomb}
            playDoubles={this.playDoubles}
            playTriples={this.playTriples}
            autoComplete={this.autoComplete}
            isDoublesOnly={this.state.isDoublesOnly}
            isTriplesOnly={this.state.isTriplesOnly}
            completion={completion}
            />
        </div>
        <div className="row">
          {gameButton}
          {needMorePlayersMessage}
        </div>
      </div>
    )
  }
}

export default GameBoard
