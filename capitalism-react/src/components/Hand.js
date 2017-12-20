import React, {Component} from 'react';
 import './Hand.css';

 import Card from './Card';
 import Double from './Double';
 import Triple from './Triple';
 import AutoComplete from './AutoComplete';

 class Hand extends Component {
   constructor(props){
     super(props);
     this.state = {
       images: {}
     }
     this.importAll = this.importAll.bind(this)
     this.isLegalCardToPlay = this.isLegalCardToPlay.bind(this)
     this.createDoublesTriplesAutos = this.createDoublesTriplesAutos.bind(this)
   }

    importAll(r) {
     let images = {};
      r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
      return images;
    }
  isLegalCardToPlay(card){
    // ** COMING SOON **
    // disable all moves if the player has scummed out
    // if(turn.hasScummedOut){
    //   x.disabled = true;
    //   return;
    // }
    // when the pile is empty
    if(!this.props.topCard){
      // And the card isn't a 2, enabled it. Otherwise, disable all bombs.
      if(card.rank === 13){
        return false;
      } else {
        return true;
      }
      // if the pile does have cards
    } else {
      // Bombs are always playable
      if(card.rank === 13){
        return true;
      }
      // check if the card has a higher rank
      if(card.rank >= this.props.topCard.rank){
        return true;
        // ** COMING SOON **
        // // if it's doubles only
        // if(this.isDoublesOnly){
        //   // enable the doubles
        //   if(x.className.match(/double/gi)){
        //     x.disabled = false;
        //     return;
        //     // disable the non-doubles
        //   } else {
        //     x.disabled = true;
        //     return;
        //   }
        //   // if it's triples only
        // } else if(this.isTriplesOnly) {
        //   // enable the triples
        //   if(x.className.match(/triple/gi)){
        //     x.disabled = false;
        //     return;
        //     // disable the non-triples
        //   } else {
        //     x.disabled = true;
        //     return;
        //   }
        //   // if it's a singles party, enable the singles and disable the doubles
        // } else {
        //   if(x.className.match(/double/gi) || x.className.match(/triple/gi)){
        //     // console.log('for doubles and triples',x, topCard)
        //     x.disabled = true;
        //     return;
        //   } else {
        //     x.disabled = false;
        //     return;
        //   }
        // }
      } else {
        return false;
      }
    }
  }
  createDoublesTriplesAutos(){
    // to manage duplicates
    let uniqueKeys = [];
    let doublesTriplesAutos = [];
    for(let i = 0, hand = this.props.data.cards; i < this.props.data.cards.length - 1; i++){
      if(hand[i].rank === 13) continue;
      if(hand[i+1] && hand[i+1].rank===hand[i].rank){
        //create double button
        let double = (<Double key={`Double_${hand[i].title}`} playDoubles={this.props.playDoubles} rank={hand[i].rank} title={hand[i].title} />);
        if(uniqueKeys.indexOf(`Double_${hand[i].title}`) !== -1){
          continue;
        }
        uniqueKeys.push(`Double_${hand[i].title}`);
        doublesTriplesAutos.push(double);
      }
      if(hand[i+2] && hand[i+2].rank===hand[i].rank){
        // create triple button
        let triple = (<Triple key={`Triple_${hand[i].title}`} playTriples={this.props.playTriples} rank={hand[i].rank} title={hand[i].title} />)
        if(uniqueKeys.indexOf(`Triple_${hand[i].title}`) !== -1){
          continue;
        }
        uniqueKeys.push(`Triple_${hand[i].title}`);
        doublesTriplesAutos.push(triple);
      }
      if(hand[i+3] && hand[i+3].rank===hand[i].rank){
        // create auto-complete button
        let auto = (<AutoComplete key={`AutoComplete_${hand[i].title}`} autoComplete={this.props.autoComplete} rank={hand[i].rank} title={hand[i].title} />)
        doublesTriplesAutos.push(auto);
      }
    }
    return doublesTriplesAutos;
  }
   componentDidMount(){
     let images = this.importAll(require.context('./../../public/img', false, /\.(png|jpe?g|svg)$/));
     this.setState({images})
   }
   render() {
     let cards;
     let specials;
     let pass;
     if(this.props.data.cards){
       cards = this.props.data.cards.map((card) => {
         let enable = this.isLegalCardToPlay(card);
         if(card.image.substring(0,4) === 'img/'){
           card.image = card.image.substring(4);
         }
         return (
           <Card
            key={card.title + card.suit}
            data={card}
            title={card.title}
            rank={card.rank}
            isBomb={card.isBomb}
            suit={card.suit}
            imageSrc={this.state.images[card.image]}
            isTurn={this.props.isTurn}
            playCard={this.props.playCard}
            bomb={this.props.bomb}
            enable={enable}
            />
         )
       })
       specials = this.createDoublesTriplesAutos();
       if(this.props.isTurn){
         pass = <button onClick={this.props.pass}>Pass</button>
       } else {
         pass = <button onClick={this.props.pass} disabled>Pass</button>
       }
     }
     return (
       <div>
        {cards}<br/>
        {specials}<br/>
        {pass}
       </div>
     )
   }
 }

 export default Hand
