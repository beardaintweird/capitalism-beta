import React, {Component} from 'react';
 import './TableForm.css';
 import { withRouter } from 'react-router-dom';

 class TableForm extends Component {
   constructor(props){
     super(props);
     this.state = {
       table_name: '',
       table_id: 0
     }
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }
   componentDidMount(){

   }
   handleChange(e){
     this.setState({table_name:e.target.value})
   }
   handleSubmit(e){
     // create table
     let options = {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         name:this.state.table_name, player_limit: 6
       })
     }
     fetch('http://localhost:3000/table', options)
      .then(res => res.json())
      .then((result) => {
        console.log('new table',result);
        this.setState({
          table_id:result.id,
          table_name: ''
        })
        let options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            table_id: result.id,
            player_id: this.props.id
          })
        }
        return fetch('http://localhost:3000/table/addPlayer', options)
      })
      .then(res=>res.json())
      .then((result_two) => {
        console.log(result_two)
        this.props.updateTables(this.state.table_id)
        // this.props.joinRoom(this.state.table_id)
        // this.props.history.push(`/gameboard/${this.state.table_id}`)
      })
     e.preventDefault();
   }

   render() {
     return (
       <form className="makeTable" onSubmit={this.handleSubmit}>
        <h5>Make your own table</h5>
        <label>
          Name:
          <input type="text" value={this.state.table_name} onChange={this.handleChange} />
        </label>
        <input className="tableButtons" type="submit" value="Submit" />
      </form>
     )
   }
 }

 export default withRouter(TableForm)
