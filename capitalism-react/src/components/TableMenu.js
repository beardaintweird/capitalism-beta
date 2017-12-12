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
   }
   componentDidMount(){
     this.updateState()
   }
   updateState(){
     fetch('http://localhost:3000/table')
     .then(res=>res.json())
     .then(result => {
       this.setState({ tables: result })
     })
   }
   render() {
     return (
       <div className="container">
        <div className="row">
          <div className="col s3"></div>
          <div className="col s6">
          {
            firebase.auth().currentUser ?
            <TableForm joinRoom={this.props.joinRoom} socket={this.props.socket} />
            : ''
          }

          </div>
          <div className="col s3"></div>
        </div>
        <div className="row">
          {this.state.tables.map((table) => {
            return (
              <Table key={table.id}
              joinRoom={this.props.joinRoom}
              table_id={table.id}
              table_name={table.name}
              players={table.Players} />)
          })}
        </div>
        <p>Tables here...</p>
       </div>
     )
   }
 }

 export default withRouter(TableMenu)
