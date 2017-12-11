import React, {Component} from 'react';
 import './TableForm.css';

 class TableForm extends Component {
   constructor(props){
     super(props);
     this.state = {
       value: ''
     }
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }
   componentDidMount(){

   }
   handleChange(e){
     this.setState({value:e.target.value})
   }
   handleSubmit(e){
     // create table
     console.log(this.state.value);
     let options = {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         name:this.state.value, player_limit: 6
       })
     }
     fetch('http://localhost:3000/table', options)
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        let options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            table_id: result.id,
            player: 'Beardaintweird',
            player_id: 1
          })
        }
        return fetch('http://localhost:3000/table/addPlayer', options)
      })
      .then(res=>res.json())
      .then((result_two) => {
        console.log(result_two);
      })
     e.preventDefault();
   }
   render() {
     return (
       <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
     )
   }
 }

 export default TableForm
