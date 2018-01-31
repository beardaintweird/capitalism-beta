import React, {Component} from 'react';
import './Card.css';

class Card extends Component {
 constructor(props){
   super(props);
   this.state = {}
   this.handleClick = this.handleClick.bind(this);
 }
 componentDidMount(){

 }
 handleClick(e){
   console.log(`${this.props.title} of ${this.props.suit}`);
   if(this.props.isBomb){
     this.props.bomb(this.props.data)
   } else {
     this.props.playCard(this.props.data)
   }
 }
 render() {
   let classes = ['card'];
   this.props.enable && this.props.isTurn ? classes.push('enabled') : classes.push('disabled')
   let card = (
     <button onClick={this.handleClick} disabled>
       <img src={this.props.imageSrc} alt='' />
     </button>)
   if(this.props.isTurn && this.props.enable){
     card =    (<button onClick={this.handleClick}>
                  <img src={this.props.imageSrc} alt='' />
                </button>)
   }
   return (
     <div className={classes.join(' ')}>
      {card}
     </div>
   )
 }
}

export default Card
