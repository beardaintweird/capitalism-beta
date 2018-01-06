import React, {Component} from 'react';
 import './Triple.css';

 class Triple extends Component {
   constructor(props){
     super(props);
     this.state = {}
     this.handleClick = this.handleClick.bind(this)
   }
   componentDidMount(){

   }
   handleClick(e){
     console.log('handling click for triples');
     this.props.playTriples(this.props.title);
   }
  render() {
     return (
       <div>
       {this.props.isTurn && this.props.enabled?
        <button onClick={this.handleClick}>Triple {this.props.title}s</button>
      : <button onClick={this.handleClick} disabled>Triple {this.props.title}s</button>}
       </div>
     )
   }
 }

 export default Triple
