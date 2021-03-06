import React, {Component} from 'react';
import './PlayedCards.css';

import Card from './Card';

class PlayedCards extends Component {
 constructor(props){
   super(props);
   this.state = {
     images: {}
   }
   this.importAll = this.importAll.bind(this)
 }
 importAll(r) {
   let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
 componentDidMount(){
   let images = this.importAll(require.context('./../../public/img', false, /\.(png|jpe?g|svg)$/));
   this.setState({images})
 }
 render() {
   let cards;
   if(this.props.cards.length){
     cards = this.props.cards.map((card) => {
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
          />
       )
     })
   }
   // for rendering all played cards
   // let PlayedCards = this.state.playedCards.map((card) => {
   //
   // })
   return (
     <div className="playedCards">
      {cards}
     </div>
    )
  }
}

export default PlayedCards
