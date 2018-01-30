import React, {Component} from 'react';
import './Player.css';

class Player extends Component {
 constructor(props){
   super(props);
 }
 componentDidMount(){

 }
 render() {
   let name;
   let classes = []
   if(this.props.isTurn) {
     classes.push('active')
     this.props.username === this.props.yourUsername ? classes.push('myTurn') : ''
     name = (<p className={classes.join(' ')}>{this.props.username}</p>)
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
