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
     console.log(`${this.props.title} ${this.props.rank}`);
   }
   render() {
     return (
       <div className="card">
       {
         this.props.isTurn ?
         (<button onClick={this.handleClick}>
                   <img src={this.props.imageSrc} />
                 </button>)
        :(<button onClick={this.handleClick} disabled>
                  <img src={this.props.imageSrc} />
                </button>)
       }

       </div>
     )
   }
 }

 export default Card
