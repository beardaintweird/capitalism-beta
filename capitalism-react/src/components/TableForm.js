import React, {Component} from 'react';
 import './TableForm.css';


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
     console.log(this.state.table_name);
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
        console.log(result);
        this.setState({table_id:result.id})
        let options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            table_id: result.id,
            player: JSON.parse(JSON.stringify(localStorage.getItem('user'))).username,
            player_id: JSON.parse(JSON.stringify(localStorage.getItem('user'))).id
          })
        }
        return fetch('http://localhost:3000/table/addPlayer', options)
      })
      .then(res=>res.json())
      .then((result_two) => {
        console.log(result_two);
        this.props.joinRoom(this.state.table_id)
      })
     e.preventDefault();
   }

   render() {
     return (
       <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.table_name} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
     )
   }
 }

 export default TableForm
