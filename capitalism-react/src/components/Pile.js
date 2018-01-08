import React, {Component} from 'react';
import './Pile.css';

class Pile extends Component {
  constructor(props){
    super(props);
    this.state = {
      images: {}
    }
    this.importAll = this.importAll.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  importAll(r) {
   let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  handleClick(e){
    this.props.selectPile(this.props.pile, this.props.allPiles);
  }
  componentDidMount(){
    let images = this.importAll(require.context('./../../public/img', false, /\.(png|jpe?g|svg)$/));
    this.setState({images})
  }
  render() {
    let pile_button;
    if(this.props.isTurn){
      pile_button = (
        <button onClick={this.handleClick}>
          <img className="bottom_card" src={this.state.images["back_green.png"]} alt='' />
        </button>)
    } else {
      pile_button = (
        <button onClick={this.handleClick} disabled>
          <img className="bottom_card" src={this.state.images["back_green.png"]} alt='' />
        </button>)
    }
    return (
      <div className="pile">
        {pile_button}
        <img className="top_card" src={this.state.images[this.props.pile.cards[0].image]} />
        <p>{this.props.pile.cards.length} cards</p>
      </div>
    )
  }
}

export default Pile
