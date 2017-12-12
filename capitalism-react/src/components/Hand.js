import React, {Component} from 'react';
 import './Hand.css';

 import Card from './Card';

 class Hand extends Component {
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
     if(this.props.data.cards){
       cards = this.props.data.cards.map((card) => {
         card.image = card.image.substring(4);
         return (
           <Card
            key={card.title + card.suit}
            title={card.title}
            rank={card.rank}
            isBomb={card.isBomb}
            suit={card.suit}
            imageSrc={this.state.images[card.image]}
            isTurn={this.props.isTurn}
            />
         )
       })
     }
     return (
       <div>
        {cards}
       </div>
     )
   }
 }

 export default Hand
