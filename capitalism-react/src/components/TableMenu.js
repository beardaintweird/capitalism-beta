import React, {Component} from 'react';
import './TableMenu.css';
import TableForm from './TableForm';

import Table from './Table';

import firebase from 'firebase';
import { withRouter } from 'react-router-dom';


 class TableMenu extends Component {
   constructor(props){
     super(props);
     this.state = {
       tables: []
     }
     this.updateState = this.updateState.bind(this)
     this.joinRoom     = this.joinRoom.bind(this);
   }
   componentDidMount(){
     this.updateState()
   }
   updateState(){
     fetch('http://localhost:3000/table')
     .then(res=>res.json())
     .then(result => {
       this.setState({ tables: result })
       console.log(this.state.tables);
     })
   }
   joinRoom(table_id){
     this.props.socket.emit('joinTable', table_id)
     this.props.socket.on('hello', console.log('hello to our room!!!'))
     this.props.history.push(`/gameboard/${table_id}`)
   }
   render() {
     return (
       <div className="container">
        <div className="row">
          <div className="col s3"></div>
          <div className="col s6">
          {
            firebase.auth().currentUser ?
            <TableForm joinRoom={this.joinRoom} socket={this.props.socket} />
            : ''
          }

          </div>
          <div className="col s3"></div>
        </div>
        <div className="row">
          {this.state.tables.map((table) => {
            return (
              <Table key={table.id}
              joinRoom={this.joinRoom}
              table_id={table.id}
              table_name={table.name}
              players={table.Players}
              enabled={firebase.auth().currentUser ? true : false} />)
          })}
        </div>
        <p>Tables here...</p>
       </div>
     )
   }
 }

 export default withRouter(TableMenu)
