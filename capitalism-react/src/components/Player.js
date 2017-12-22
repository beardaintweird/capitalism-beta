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
     let name;
     if(this.props.isTurn && this.props.username === localStorage.getItem('username')) {
       console.log(`It's ${this.props.username}'s turn`);
       name = (<p className="active">{this.props.username}</p>)
     } else {
       name = (<p className="inactive">{this.props.username}</p>)
     }
     return (
       <div className="col s3">
        {name}<br/>
        <p>{this.props.ranking}</p>
       </div>
     )
   }
 }

 export default Player
