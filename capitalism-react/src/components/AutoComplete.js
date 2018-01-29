import React, {Component} from 'react';
 import './AutoComplete.css';

 class AutoComplete extends Component {
   constructor(props){
     super(props);
     this.state = {}
     this.handleClick = this.handleClick.bind(this)
   }
   componentDidMount(){

   }
   handleClick(e){
     this.props.autoComplete(this.props.title);
   }
  render() {
     return (
       <div className="tableButtons">
        {this.props.isTurn && this.props.enabled ?
          <button className="tableButtons special" onClick={this.handleClick}>Auto complete {this.props.title}s</button>
        : <button className="tableButtons special" onClick={this.handleClick} disabled>Auto complete {this.props.title}s</button>}
       </div>
     )
   }
 }

 export default AutoComplete
