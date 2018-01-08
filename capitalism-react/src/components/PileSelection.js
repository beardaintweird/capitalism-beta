import React, {Component} from 'react';
import './PileSelection.css';
import Pile from './Pile';

class PileSelection extends Component {
  constructor(props){
    super(props);
    this.state = {
<<<<<<< HEAD
      images: {}
    }
    this.importAll = this.importAll.bind(this)
  }
  importAll(r) {
   let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
=======
    }

>>>>>>> master
  }


  componentDidMount(){
    let images = this.importAll(require.context('./../../public/img', false, /\.(png|jpe?g|svg)$/));
    this.setState({images})
  }
  render() {
<<<<<<< HEAD
    let piles = this.props.piles.map(pile=>{
      pile.cards[0].image = pile.cards[0].image.substring(4);
      return (
      <div key={pile.cards[0].suit + pile.cards[0].title} className="pile">
          <img className="bottom_card" src={this.state.images["back_green.png"]} alt='' />
          <img className="top_card" src={this.state.images[pile.cards[0].image]} />
          <p>{pile.cards.length} cards</p>
      </div>)
=======
    let piles = this.props.piles.map((pile,index)=>{
      pile.cards[0].image = pile.cards[0].image.substring(4);
      return (
          <Pile
            key={index}
            pile={pile}
            allPiles={this.props.piles}
            selectPile={this.props.selectPile}
            isTurn={this.props.isTurn}/>
      )
>>>>>>> master
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
