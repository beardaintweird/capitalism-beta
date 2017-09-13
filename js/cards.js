var Cards = (function(){
  return {
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
     getCardImages(){
       console.log('In get card images');
       $.ajax({
         url: 'https://deckofcardsapi.com/api/deck/new/draw?count=52',
         type: "GET"
       }).done(function(res){
         console.log(res);
       })
     }
  }
})();
