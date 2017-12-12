var Game = (function(){
  return {
    numOfPlayers: 4, // change to input from HTML
    players: [],
    playersWhoScummedOut: [],
    playArea: [],
    isDoublesOnly: false,
    isTriplesOnly: false,
    createPlayers(){
      this.players = [];
      for(let i = 0, x = this.numOfPlayers; i < x; i++){
        let obj = {
          number: i,
          hand: null,
          isTurn: false,
          // justCompleted: false,
          isDone: false,
          hasScummedOut: false
        };
        this.players.push(obj);
      }
      return this.players;
    },
    deal(deck){
      let x = 0;
      let piles = [];
      // make the piles
      for(let i = 0, x = this.numOfPlayers; i < x; i++){
        piles.push({
          light: false,
          cards: []
        });
      }
      // hand each card out one by one
      for(let i = 0; i < 52; i++){
        if(x === this.numOfPlayers){
          x = 0;
        }
        piles[x].cards.push(deck[i]);
        x++;
      }
      // label light or not
      for(let i = 0, x = piles.length; i < x; i++){
        if(piles[i].cards.length < (52 / this.numOfPlayers)){
          piles[i].light = true;
        }
      }
      // done
      return piles;
    },
    assignHands(isFirstGame, piles, players){
      if(isFirstGame){
        // assigning the hands
        for(let i = 0, x = this.numOfPlayers; i < x; i++){
          this.players[i].hand = piles[i];
        }
        // whoever holds the 3 of clubs goes first!
        this.players.map((x)=>{
          return x.hand.cards.map((y)=>{
            if(y.title === 3 && y.suit === 'clubs'){
              x.isTurn = true;
            }
          });
        });
        // this.renderHands(players);
        return this.players;
      } else {
        // logic for games after the first
      }
    },
    /*
    TODO: change this to render only the current player's hand
          pass the player's hand
          pass the current player
          render the other buttons as well

          m-- next: renderDoublesTriplesQuads --
    */
    renderHands(player){
        player.hand.cards.sort((a,b)=> a.rank - b.rank);
        if($(`#p${player.number}-hand`).length){
          $(`#p${player.number}-hand`).children().remove();
        } else {
          $(`#p${player.number}`).append(`<div class="hand" id="p${player.number}-hand"></div>`)
        }
        for(let j = 0, y = player.hand.cards.length; j < y; j++){
          $(`#p${player.number}-hand`).append(`
            <button value = "${player.hand.cards[j].rank}"
            class="player${player.number}-hand" id="${player.hand.cards[j].title}of${player.hand.cards[j].suit}">
              <img src='${player.hand.cards[j].image}'></img>
            </button>
            `);
        }
        this.renderDoublesTriplesQuads(players[i]);
        if(!$(`#player${player.number}-buttons`).length){
          $(`#p${player.number}`)
          .append(`<div class="playerHandButtons" id="player${player.number}-buttons"></div>`)
        }
        if(!$(`#player${player.number}-complete`).length){
          $(`#player${player.number}-buttons`).append(`<button id="player${player.number}-complete" class="completionBtn">Complete</button>`);
        }
        if(!$(`#player${player.number}-pass`).length){
          $(`#player${player.number}-buttons`).append(`<button class="passBtn" id="player${player.number}-pass">Pass</button>`);
        }
        // remove the complete and pass buttons from players who are done
        if(player.isDone){
          $(`#player${player.number}-pass`).remove();
          $(`#player${player.number}-complete`).remove();
        }
    },
    play(isFirstGame, players){
      this.renderHands(players);
      let turn = this.players.filter((x)=> x.isTurn);
      turn = turn[0];
      // clear the pile before it makes a full trip around
      if(this.playArea.length && this.playArea[this.playArea.length - 1].player == turn.number){
        setTimeout(this.clearPlayArea(),500);
      }
      // check for scum out
      this.checkForScumOut(turn);
      // if the player is done, skip him
      if(turn.isDone) {
        console.log(`player ${turn.number} is done sooo next player.`)
        return this.changeTurns(turn);
      }
      console.log(`It's player ${turn.number}'s turn`, turn);
      let currentHand = turn.hand.cards;
      let selectedCard = null;
      let cardPlayed = 0;
      //
      $('.completionBtn').prop('disabled', true);
      $('.currentTurn').removeClass('currentTurn');
      $(`#p${turn.number}`).addClass('currentTurn');
      $('.hand').hide();
      $('.passBtn').hide();
      $(`#player${turn.number}-pass`).show();
      $('.currentTurn .hand').show();

      this.enableLegalCards(turn);
      // if it's the first play of the first game
      if(isFirstGame){
        $(`.passBtn`).prop('disabled',true);
        // play the 3 of clubs
        currentHand.map((x,i)=>{
          if(x.title === 3 && x.suit === 'clubs') {
            cardPlayed = i;
          }
        });
        // remove the 3 of clubs
        $(`.player${turn.number}-hand.${currentHand[cardPlayed].title}of${currentHand[cardPlayed].suit}`).remove();
        //render it being played
        this.renderPlay(currentHand.splice(cardPlayed, 1)[0], turn.number);
        // change turns to the next player
        this.changeTurns(turn);
        return this.checkForCompletions(turn);
      } else {
        $(`.passBtn`).prop('disabled',true);
        $(`#player${turn.number}-pass`).prop('disabled',false);
        $(`#player${turn.number}-pass`).unbind().on('click', ()=>{
          (function(){
            this.Game.changeTurns(turn);
          })();
        });
        $(`.player${turn.number}-hand`).unbind().on('click', function(){
          // checks if the same card was selected twice
          if(this == selectedCard){
            const playMultiples = function(num, str){
              let card = null;
              let set = currentHand.filter((x,i) =>{
                return parseInt(selectedCard.value) === x.rank;
              });
              return (function(){
                if(!this.Game.playArea.length){
                  if(num === 2) this.Game.isDoublesOnly = true;
                  if(num === 3) this.Game.isTriplesOnly = true;
                }
                for(let j = 0; j < num; j++){
                  currentHand.map((x,i)=>{
                    if(set[j].rank == x.rank)
                      cardPlayed = i;
                  });
                  card = currentHand.splice(cardPlayed,1)[0];
                  this.Game.renderPlay(card,turn.number);
                  if(num === 2 && j === 1){
                    let playArea = this.Game.playArea;
                    // If the doubles that are being played are equal to the doubles just played
                    // AND the doubles that were played weren't from the same player
                    // then clear the play area and don't change turns
                    if(playArea.length >= 3
                      && card.rank === playArea[playArea.length - 3].card.rank
                      && card.rank === playArea[playArea.length - 4].card.rank
                      && turn.number !== playArea[playArea.length - 3].player
                      ){
                      console.log('the set of doubles and the top cards are the same');
                      this.Game.clearPlayArea();
                      turn.justCompleted = true;
                    }
                  }
                  if(num === 4 && j === 3){
                    console.log('AUTO-COMPLETE');
                    this.Game.clearPlayArea();
                    turn.justCompleted = true;
                  }
                  this.Game.changeTurns(turn);
                }
                this.Game.checkForCompletions(turn);
              })();
            }
            // checks if a double was selected
            if($(this).attr('class').match(/double/gi) && $(this).attr('class').match(/double/gi)[0] == 'double'){
              console.log('selected a double');
              let set = currentHand.filter((x,i) =>{
                return parseInt(selectedCard.value) === x.rank;
              });
              return playMultiples(2);
            }
            // checks if a triple was selected
            if($(this).attr('class').match(/triple/gi) && $(this).attr('class').match(/triple/gi)[0] == 'triple'){
              console.log('selected a triple');
              let set = currentHand.filter((x,i) =>{
                return parseInt(selectedCard.value) === x.rank;
              })
              return playMultiples(3);
            }
            // checks if auto-completion was selected
            if($(this).attr('class').match(/quad/gi) && $(this).attr('class').match(/quad/gi)[0] == 'quad'){
              let set = currentHand.filter((x,i)=>{
                return parseInt(selectedCard.value) === x.rank;
              });
              return playMultiples(4);
            }
            const playCard = function(){
              let card = null;
              //finds the proper card
              currentHand.map((x,i)=>{
                if(selectedCard.value == x.rank)
                  cardPlayed = i;
              });
              // removes it from the player's hand
              card = currentHand.splice(cardPlayed, 1)[0];
              // checks if it was a bomb
              if(parseInt(selectedCard.value) === 13){
                // gotta play the card
                this.Game.renderPlay(card, turn.number);
                // clears the pile
                this.Game.clearPlayArea();
                // just resets the play to the current player because calling change turns is unnecessary
                return this.Game.play(false, players);
              }
              // checks the pile if a 4-straight individual or doubles completion was made
              if(this.Game.checkForUnconventionalCompletion(card)){
                console.log('making an unconventional completion')
                // plays the card
                this.Game.renderPlay(card, turn.number);
                // clears the pile
                this.Game.clearPlayArea();
                // just resets the play to the current player because calling change turns is unnecessary
                return this.Game.play(false, players);
              }
              // plays the card
              this.Game.renderPlay(card, turn.number);
              // changes turns
              this.Game.changeTurns(turn, card);
              // check for completions in the other players' hands'
              this.Game.checkForCompletions(turn);
            }
            playCard();

            selectedCard = null;
          } else {
            // console.log($(this).attr('class').match(/double/gi)[0])
            $('.clicked').removeClass('clicked');
            $(this).addClass('clicked');
            selectedCard = this;
          }
        });
      }
    },
    renderPlay(card,id){
      this.playArea.push({
        card: card,
        player: id
      });
      console.log(`Player ${id} played a ${card.title}`)
      $('.lastPlayed').removeClass('lastPlayed');
      $('#playArea').append(`
        <img class="lastPlayed" value="${card.title}" src="${card.image}"> </img>`);
      this.updateRankings(id);
    },
    updateRankings(id){
      let finishedPlayer = null;
      // if the player has no cards left
      if(!this.players[id].hand.cards.length) {
        console.log(`player ${id} is done`);
        // mark them as done
        this.players[id].isDone = true;
        finishedPlayer = this.players[id];
        // make their position clear
        let str = '';
        let len = (function(){return this.Rankings.rankings.length})();
        console.log('length of the rankings array', len);
        switch(len + 1){
          case 1:
            str     = 'President';
            break;
          case 2:
            str     = 'Vice President';
            break;
          default:
            if(len === this.players.length - 2){
              str   = 'Scum 1';
            } else if (len === this.players.length - 1){
              str   = 'Scum 2';
            } else {
              str   = `Commoner ${len - 1}`;
            }
        }
        $(`#p${id}`).append(`<h1 id='${str}'>${str}</h1>`);
      }
      return (function(){
                if(finishedPlayer)
                  this.Rankings.rankings.push(finishedPlayer);
                if(this.Rankings.rankings.length){
                  console.log(this.Rankings.rankings);
                if(this.Rankings.rankings.length === this.Game.players.length)
                  this.Rankings.assignPositions();
                }
              })();
    },
    // TODO: complete the scumming out logic
    addScummedOutToRankings(){
      // if no one scummed out, do nothing
      if(!this.playersWhoScummedOut.length) return;
      // if 2 people scummed out
      if(this.playersWhoScummedOut.length === 2){
        let scum2 = this.playersWhoScummedOut.pop();
        $(`#p${scum2.number}`).append(`<h1 id='scum2'>Scum 2</h1>`)
        let scum1 = this.playersWhoScummedOut.pop();
        $(`#p${scum1.number}`).append(`<h1 id='scum1'>Scum 1</h1>`)
        return (function(){
          this.Rankings.rankings.push(scum1);
          this.Rankings.rankings.push(scum2);
        })();
      } else {
        // if one person scummed out
        let scum2 = this.playersWhoScummedOut.pop();
        $(`#p${scum2.number}`).append(`<h1 id='scum2'>Scum 2</h1>`)
        return (function(){
          this.Rankings.rankings.push(scum2);
        })();
      }
    },
    changeTurns(turn, card){
      turn.isTurn = false;
      $(`.player${turn.number}-hand`).off();
      $(`#player${turn.number}-pass`).off();
      $(`#player${turn.number}-pass`).prop('disabled', true);

      // if everyone is done, end the game (aka stop the function call loop)
      // update: account for players who have scummed out
      let donePlayers = this.players.filter((x)=>x.isDone);
      if(donePlayers.length
        &&
        (donePlayers.length + this.playersWhoScummedOut.length) === this.players.length){
        this.addScummedOutToRankings();
        console.log('Game Over');
        $('#board').fadeOut();
        $('.container').append('<h1>Game Over</h1>');
        return;
      }
      // change the turn to the next guy
      turn = turn.number === this.players.length - 1 ? this.players[0] :
        this.players[turn.number + 1];
      turn.isTurn = true;
      /*
      -----------------For skipping players-----------------
      */
      // the card condition is for the first move edge case
      if(card && this.checkForSkip(card) && !this.isDoublesOnly && !this.isTriplesOnly){
        turn.isTurn = false;
        // switches the turn to the next player
        turn = turn.number === this.players.length - 1 ? this.players[0] : this.players[turn.number + 1];
        turn.isTurn = true;
        console.log('SKIEP');
      }
      /*
      -----------------TODO:For completions-----------------
      */
      if(this.players.filter((x)=>x.justCompleted === true).length){
        console.log('there is a player who has completed')
        for(let i =0, x = this.players.length; i < x; i++){
          this.players[i].isTurn = false;
          if(this.players[i].justCompleted){
            console.log('Player who just completed', this.players[i]);
            this.players[i].isTurn = true;
            this.players[i].justCompleted = false;
          }
        }
      }
      // keep the game playing
      this.play(false, this.players);
    },
    /*
    Description: Skips the next player if the card played matches the rank of the card underneath it
    Args:
      card - passed in from playCard() within play()
      * same card used in renderPlay() for consistency
    Return:
      true for skip, false for otherwise
    */
    checkForSkip(card){
      // checks if the pile was empty before the last card was played
      if(this.playArea.length < 2) return;
      // gets the card below the topCard
      let comparisonCard = this.playArea[this.playArea.length - 2].card;
      // checks if the card played is the same rank as the card on top of the pile
      return card.rank === comparisonCard.rank;
    },
    clearPlayArea(){
      console.log('pile cleared')
      this.playArea = [];
      $('#playArea img').remove();
      this.isDoublesOnly = false;
      this.isTriplesOnly = false;
    },
    checkForCompletions(turn){
      let topCard = this.playArea[this.playArea.length - 1];
      let possibleCompletion = [topCard];
      let playArea = this.playArea;
      let count = 2;
      // if the playArea was just cleared, exit
      if(!this.playArea.length) return;

      // gets the cards in the pile of the same rank
      while(playArea.length - count >= 0
        &&
        topCard.card.rank == playArea[playArea.length - count].card.rank){
        possibleCompletion.push(playArea[playArea.length - count]);
        count++;
      }
      // check for completion in each hand
      for(let i = 0, x = this.players.length; i < x; i++){
        let completionCards = {
          player: this.players[i],
          set: []
        };
        completionCards.set = this.players[i].hand.cards.filter((x)=>{
          return x.rank === topCard.card.rank;
        });
        if(completionCards.set.length + possibleCompletion.length === 4){
          // found potential completion
          possibleCompletion = possibleCompletion.concat(completionCards.set);
          // activate the completion button
          $(`#player${this.players[i].number}-complete`).prop('disabled', false);
          $(`#player${this.players[i].number}-complete`).unbind().on('click', function(){
            console.log('in completion execution');
            return (function(){
              let count = 0;
              let hand = this.Game.players[i].hand.cards;
              // play the cards
              for(let j = 0, y = completionCards.set.length; j < y; j++){
                let cardPlayed;
                hand.map((x,i)=>{
                  if(completionCards.set[j].rank == x.rank)
                    cardPlayed = i;
                });
                this.Game.renderPlay(hand.splice(cardPlayed,1)[0],this.Game.players[i].number);
              }
              console.log('COMPLETE COMPLETE COMPLETE');
              $(`#player${this.Game.players[i].number}-complete`).prop('disabled', true);
              setTimeout(this.Game.clearPlayArea(), 2000);
              this.Game.players[i].justCompleted = true;
              this.Game.changeTurns(turn, null);
            })();
          });
          break;
        }
      }
    },
    checkForUnconventionalCompletion(card){
      // clear the pile as if it was as complete when 4 straight individual cards have been played
      if(this.playArea.length >= 3){
        let playArea      = this.playArea;
        let topCard       = playArea[playArea.length - 1];
        let lastFourCards = [topCard];
        let count         = 2;
        while(playArea[playArea.length - count] && topCard.card.rank == playArea[playArea.length - count].card.rank){
          lastFourCards.push(playArea[playArea.length - count]);
          count++;
        }
        if(lastFourCards.length >= 3 && card.rank === lastFourCards[lastFourCards.length - 1].card.rank){
          console.log('should complete', lastFourCards, card);
          return true;
        }
      }
      return false;
    },
    checkForScumOut(turn){
      let bombs = turn.hand.cards.filter((x)=>{
        return x.rank === 13;
      });
      // checks if they have to end on a two
      if(!this.playArea.length && bombs.length >= turn.hand.cards.length && turn.isTrue){
        // if this player hasn't already scummed out
        if(!turn.hasScummedOut){
          console.log(`Player ${turn.number} has scummed out.`);
          turn.hasScummedOut = true;
          this.playersWhoScummedOut.push(turn);
        }
      }
    },
    /*
    TODO: Call this when it's their turn
          pass in the player
          pass in the hand
    */
    renderDoublesTriplesQuads(turn){
      $(`#p${turn.number}-hand`)
      .append('<br>');
      for(let i = 0, hand = turn.hand.cards; i < hand.length - 1; i++){
        if(hand[i].rank === 13) continue;
        if(hand[i+1] && hand[i+1].rank===hand[i].rank){
          //create double button
          if(!$(`#p${turn.number}-double${hand[i].title}`).length){
            $(`#p${turn.number}-hand`)
            .append(`<button value="${hand[i].rank}" class="player${turn.number}-hand double" id="p${turn.number}-double${hand[i].title}">
                      Double ${hand[i].title}'s
                    </button>`);
          }
        }
        if(hand[i+2] && hand[i+2].rank===hand[i].rank){
          // create triple button
          if(!$(`#p${turn.number}-triple${hand[i].title}`).length){
            $(`#p${turn.number}-hand`)
            .append(`<button value="${hand[i].rank}" class="player${turn.number}-hand triple" id="p${turn.number}-triple${hand[i].title}">
                      Triple ${hand[i].title}'s
                    </button>`);
          }
        }
        if(hand[i+3] && hand[i+3].rank===hand[i].rank){
          // create auto-complete button
          if(!$(`#p${turn.number}-quad${hand[i].title}`).length){
            $(`#p${turn.number}-hand`)
            .append(`<button value="${hand[i].rank}" class="player${turn.number}-hand quad" id="p${turn.number}-quad${hand[i].title}">
                      Auto-complete ${hand[i].title}'s
                    </button>`);
          }
        }
      }
    },
    checkFinished(player){
      return !player.hand.cards.length
    },
    enableLegalCards(turn){
      let cardsInHand = $(`.player${turn.number}-hand`);
      let topCard = this.playArea.length ? this.playArea[this.playArea.length -1].card : null;
      cardsInHand.map((i,x)=>{
        // disable all moves if the player has scummed out
        if(turn.hasScummedOut){
          x.disabled = true;
          return;
        }
        let cardRank = parseInt(x.value);
        // when the pile is empty
        if(!this.playArea.length){
          // And the card isn't a 2
          if(cardRank === 13){
            console.log('Can\'t bomb an empty pile')
            x.disabled = true;
            return;
          } else {
            x.disabled = false;
            return;
          }
          // if the pile does have cards
        } else {
          // Bombs are always playable
          if(cardRank === 13){
            x.disabled = false;
            return;
          }
          // check if the card has a higher rank
          if(cardRank >= topCard.rank){
            // if it's doubles only
            if(this.isDoublesOnly){
              // enable the doubles
              if(x.className.match(/double/gi)){
                x.disabled = false;
                return;
                // disable the non-doubles
              } else {
                x.disabled = true;
                return;
              }
              // if it's triples only
            } else if(this.isTriplesOnly) {
              // enable the triples
              if(x.className.match(/triple/gi)){
                x.disabled = false;
                return;
                // disable the non-triples
              } else {
                x.disabled = true;
                return;
              }
              // if it's a singles party, enable the singles and disable the doubles
            } else {
              if(x.className.match(/double/gi) || x.className.match(/triple/gi)){
                // console.log('for doubles and triples',x, topCard)
                x.disabled = true;
                return;
              } else {
                x.disabled = false;
                return;
              }
            }
          } else {
            x.disabled = true;
          }
        }
      });
    }
  }
})();
