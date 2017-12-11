import React, {Component} from 'react';
 import './TableMenu.css';
import TableForm from './TableForm';

 class TableMenu extends Component {
   constructor(props){
     super(props);
     this.state = {}
   }
   componentDidMount(){

   }
   render() {
     return (
       <div>
        <TableForm />
        <p>Tables here...</p>
       </div>
     )
   }
 }

 export default TableMenu
