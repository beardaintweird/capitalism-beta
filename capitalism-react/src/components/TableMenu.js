import React, {Component} from 'react';
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
   }
   render() {
     let tables;
     let tableForm = this.props.isLoggedIn ?
      (<TableForm
        joinRoom={this.props.joinRoom}
        socket={this.props.socket}
        updateTables={this.props.updateTables}
        id={this.props.id} />)
      : '';
     if(this.props.tables){
       console.log('tableMenu tables',this.props.tables);
       tables = this.props.tables.map((table) => {
         let playerNames = table.players.map(player=>player.username)
         return (
           <Table key={table.id}
           id={this.props.id}
           table_id={table.id}
           table_name={table.name}
           players={playerNames}
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
          <div className="col s4"></div>
          <div className="col s4 signIn">
            {tableForm}
          </div>
          <div className="col s4"></div>
        </div>
        <br/><br/><br/><br/><br/>
        <div className="row tableRow">
          {tables}
        </div>
       </div>
     )
   }
 }

 export default withRouter(TableMenu)
