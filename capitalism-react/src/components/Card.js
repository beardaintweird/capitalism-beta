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
     console.log(`${this.props.title} of ${this.props.suit}.`);
     this.props.playCard(this.props.data)
   }
   render() {
     return (
       <div className="card">
       {
         this.props.isTurn && this.props.enable ?
         (<button onClick={this.handleClick}>
                   <img src={this.props.imageSrc} alt='' />
                 </button>)
        :(<button onClick={this.handleClick} disabled>
                  <img src={this.props.imageSrc} alt='' />
                </button>)
       }

       </div>
     )
   }
 }

 export default Card
