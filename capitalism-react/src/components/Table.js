import React, {Component} from 'react';
 import './Table.css';

 class Table extends Component {
   constructor(props){
     super(props);
     this.state = {}
     this.handleClick = this.handleClick.bind(this);
   }
   componentDidMount(){

   }
   handleClick(e){
     const options = {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(
         {
           table_id: this.props.table_id,
           player: 'Beardaintweird',
           player_id: 1
         })
     }
     fetch('http://localhost:3000/table/addPlayer', options)
      .then(res=>res.json())
      .then((result) => {
        console.log(result);
        this.props.joinRoom(this.props.table_id)
      })
     console.log('clicked join');
   }
   render() {
     return (
       <div className="col s3">
        <div className="card white">
          <div className="card-content black-text">
            <span className="card-title">{this.props.table_name}</span>
            <ul>
              {this.props.players ? this.props.players.map((player) => {
                return (<li key={player.id}>{player.username}</li>)
              }) : 'no players'
            }
            </ul>
            {
              this.props.enabled ?
                <button onClick={this.handleClick} >Join</button>
              :
                <div>
                  <p>Sign in to join a table</p>
                </div>
            }

          </div>
        </div>
       </div>
     )
   }
 }

 export default Table
