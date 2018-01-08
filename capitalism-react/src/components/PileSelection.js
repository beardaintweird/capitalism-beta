import React, {Component} from 'react';
import './PileSelection.css';

class PileSelection extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){

  }
  render() {
    console.log('piles:',this.props.piles)
    return (
      <div className="row">
        {/* iterate over this.props.piles to make the piles and flip over the top card */}
      </div>
    )
  }
}

export default PileSelection
