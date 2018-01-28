import React, {Component} from 'react';
import './Player.css';

class Player extends Component {
 constructor(props){
   super(props);
   this.state = {
     timer: -1
   }
 }
 componentDidMount(){

 }
 render() {
   let name;
   if(this.props.isTurn) {
     // if(this.state.timer < 0){
     //  this.setState({timer: 15}) 
     // }

     // console.log(`It's ${this.props.username}'s turn`);
     name = (<p className="active">{this.props.username}</p>)
   } else {
     name = (<p className="inactive">{this.props.username}</p>)
   }
   return (
     <div className="col s3">
      {name}<br/>
      {this.props.ranking}
      <p className="prev_ranking">{this.props.previousRanking}</p>
     </div>
   )
 }
}

export default Player
