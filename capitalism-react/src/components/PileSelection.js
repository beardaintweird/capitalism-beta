import React, {Component} from 'react';
import './PileSelection.css';
import Pile from './Pile';

class PileSelection extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  componentDidMount(){

  }
  render() {
    let piles = this.props.piles.map((pile,index)=>{
      return (
          <Pile
            key={index}
            pile={pile}
            allPiles={this.props.piles}
            selectPile={this.props.selectPile}
            isTurn={this.props.isTurn}/>
      )
    })
    return (
      <div className="row">
        {/* iterate over this.props.piles to make the piles and flip over the top card */}
        <div className="col s12">
          {piles}
        </div>
      </div>
    )
  }
}

export default PileSelection
