import React, {Component} from 'react';
import './Completion.css';

class Completion extends Component {
 constructor(props){
   super(props);
   this.state = {}
   this.handleClick = this.handleClick.bind(this);
 }
 componentDidMount(){

 }
 handleClick(){
   console.log('handling completion click.');
   this.props.playCompletion(this.props.data)
 }
 render() {
   return (
     <div>
     {
       this.props.enabled ?
        <button onClick={this.handleClick}>Complete the {this.props.title}s!</button>
        : <button disabled>Nothing to complete</button>
     }
     </div>
   )
 }
}

 export default Completion
