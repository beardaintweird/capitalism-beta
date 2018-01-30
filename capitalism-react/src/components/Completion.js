import React, {Component} from 'react';

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
   let complete = '';
   if(this.props.enabled)
    complete = (<button className="tableButtons special completion" onClick={this.handleClick}>Complete the {this.props.title}s!</button>)
  else if(this.props.game_underway)
    complete = (<button className="tableButtons special" disabled>No completions</button>)
   return (
     <div>
      {complete}
     </div>
   )
  }
}

export default Completion
