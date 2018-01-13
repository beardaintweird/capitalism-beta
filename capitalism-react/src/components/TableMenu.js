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
     }
   }
   componentDidMount(){
     this.props.updateTables()
   }
   render() {
     let tables;
     let tableForm = this.props.isLoggedIn ?
      (<TableForm joinRoom={this.props.joinRoom} socket={this.props.socket} />)
      : '';
     if(this.props.tables){
       tables = this.props.tables.map((table) => {
         return (
           <Table key={table.id}
           table_id={table.id}
           table_name={table.name}
           players={table.Players}
           username={this.props.username}
           joinRoom={this.props.joinRoom}
           isLoggedIn={this.props.isLoggedIn}
           updateTableId={this.props.updateTableId}
           playerTableId={this.props.playerTableId} />)
       })
     }
     return (
       <div className="container">
        <div className="row">
          <div className="col s3"></div>
          <div className="col s6">
          {tableForm}
          </div>
          <div className="col s3"></div>
        </div>
        <div className="row">
          {tables}
        </div>
       </div>
     )
   }
 }

 export default withRouter(TableMenu)
