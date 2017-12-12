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
     return (
       <div className="col s3">
        <p>{this.props.username}</p>
       </div>
     )
   }
 }

 export default Player
