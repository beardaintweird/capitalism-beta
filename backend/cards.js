module.exports = {
  suits: ['spades', 'diamonds', 'clubs', 'hearts'],
  createDeck(){
    console.log('creating the deck');
   //  this.getCardImages();
    const deck = [];
    for(let i = 0; i < 4; i++){
      let title = 3;
      let rank = 1;
      for(let j = 0; j < 13; j++){
        switch(title){
          case 11:
            faceTitle = 'jack'
            break;
          case 12:
            faceTitle = 'queen'
            break;
          case 13:
            faceTitle = 'king'
            break;
          case 14:
            faceTitle = 'ace'
            break;
          case 15:
            faceTitle = 'bomb'
            break;
          default:
            break;
        }
        let imageUrl = `img/`;
        if(title < 11) {
          imageUrl += `${title}_of_${this.suits[i]}.png`
        } else if(rank === 13) {
          imageUrl += `2_of_${this.suits[i]}.png`
        } else {
          imageUrl += `${faceTitle}_of_${this.suits[i]}.png`
        }
        let obj = {
          title: title < 11 ? title : faceTitle,
          rank: rank,
          isBomb: title === 15 ? true : false,
          suit: this.suits[i],
          image: imageUrl
        }
        deck.push(obj);
        title++;
        rank++;
      }
    }
    return deck;
  },
  shuffle(array){
    var m = array.length;
    var t;
    var i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },
  makeDeck(){
    let deck = this.createDeck();
    return this.shuffle(deck);
  },
  makePiles(deck, numberOfPlayers){
    let x = 0;
    let piles = [];
    // make the piles
    for(let i = 0, x = numberOfPlayers; i < x; i++){
      piles.push({
        light: false,
        cards: []
      });
    }
    // hand each card out one by one
    for(let i = 0; i < 52; i++){
      if(x === numberOfPlayers){
        x = 0;
      }
      piles[x].cards.push(deck[i]);
      x++;
    }
    // lable light or not
    for(let i = 0, x = piles.length; i < x; i++){
      if(piles[i].cards.length < (52 / numberOfPlayers)){
        piles[i].light = true;
      }
    }
    // done
    return piles;
  },
  dealRandomly(deck, players){
    let piles = this.makePiles(deck, players.length)
    // assigning the hands
    for(let i = 0, x = players.length; i < x; i++){
      piles[i].cards.sort((a,b) => a.rank - b.rank);
      players[i].hand = piles[i];
    }
    // whoever holds the 3 of clubs goes first!
    players.map((player)=>{
      return player.hand.cards.map((card)=>{
        if(card.title === 3 && card.suit === 'clubs'){
          player.isTurn = true;
        }
      });
    });
    return players;
  }
}
