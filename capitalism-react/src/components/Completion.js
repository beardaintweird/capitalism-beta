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
   console.log('handling completion click. ');
   this.props.playCompletion(this.props.data)
 }
 render() {
   let complete = '';
   if(this.props.enabled)
    complete = (<button onClick={this.handleClick}>Complete the {this.props.title}s!</button>)
   return (
     <div>
      {complete}
     </div>
   )
 }
}

 export default Completion
