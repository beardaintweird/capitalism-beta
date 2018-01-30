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
    let auto;
    if(this.props.isTurn && this.props.enabled)
      auto = (<button className="tableButtons special" onClick={this.handleClick}>Auto complete {this.props.title}s</button>)
    else
      auto = (<button className="tableButtons special" onClick={this.handleClick} disabled>Auto complete {this.props.title}s</button>)
     return (
       {auto}
     )
   }
}

export default AutoComplete
