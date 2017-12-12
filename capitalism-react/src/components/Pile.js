import React, {Component} from 'react';
 import './Pile.css';

 class Pile extends Component {
   constructor(props){
     super(props);
     this.state = {
       playedCards: []
     }
   }
   componentDidMount(){

   }
   render() {
     // for rendering all played cards
     // let pile = this.state.playedCards.map((card) => {
     //
     // })
     return (
       <div></div>
      )
    }
 }

 export default Pile
