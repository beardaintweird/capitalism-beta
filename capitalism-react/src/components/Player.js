import React, {Component} from 'react';
import './Player.css';

 class Player extends Component {
   constructor(props){
     super(props);
     this.state = {}
   }
   componentDidMount(){

   }
   render() {
     if(this.props.isTurn) {
       console.log(`it's ${this.props.username}'s turn`);
     }
     return (
       <div className="col s3">
       {
         this.props.isTurn ?
          (<p><strong>{this.props.username}</strong></p>)
          : (<p>{this.props.username}</p>)
       }

       </div>
     )
   }
 }

 export default Player
