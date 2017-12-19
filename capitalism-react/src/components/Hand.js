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
     let pass;
     if(this.props.data.cards){
       cards = this.props.data.cards.map((card) => {
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
            />
         )
       })
       if(this.props.isTurn){
         pass = <button onClick={this.props.pass}>Pass</button>
       } else {
         pass = <button onClick={this.props.pass} disabled>Pass</button>
       }
     }
     return (
       <div>
        {cards}<br/>
        {pass}
       </div>
     )
   }
 }

 export default Hand
