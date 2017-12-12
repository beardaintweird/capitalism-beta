import React, {Component} from 'react';
 import './Card.css';

 class Card extends Component {
   constructor(props){
     super(props);
     this.state = {}
   }
   componentDidMount(){

   }
   render() {
     return (
       <div>
        <img src={this.props.imageSrc} />
       </div>
     )
   }
 }

 export default Card
