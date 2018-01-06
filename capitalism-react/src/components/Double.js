import React, {Component} from 'react';
 import './Double.css';

 class Double extends Component {
   constructor(props){
     super(props);
     this.state = {}
     this.handleClick = this.handleClick.bind(this)
   }
   componentDidMount(){

   }
   handleClick(e){
     this.props.playDoubles(this.props.title);
   }
  render() {
     return (
       <div>
       {this.props.isTurn && this.props.enabled ?
         <button onClick={this.handleClick}>Double {this.props.title}s</button>
       : <button onClick={this.handleClick} disabled>Double {this.props.title}s</button>}
       </div>
     )
   }
 }

 export default Double
