import React, {Component} from 'react';

import firebase from './../firebase';

import { createUser } from './../api';

import {withRouter} from 'react-router-dom';

 class SignUp extends Component {
   constructor(props){
     super(props);
     this.state = {
       first_name: '',
       last_name: '',
       username: '',
       email: '',
       password: '',
       error: ''
     }
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.updateError = this.updateError.bind(this);
   }
   componentDidMount(){

   }
   handleChange(e){
     this.setState({ [e.target.id]:e.target.value })
   }

   handleSubmit(e){
     let error = ''
     firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        createUser(this.state.first_name, this.state.last_name, this.state.username, this.state.email);
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
          this.props.history.push('/');
        }).catch((err) => {
          this.updateError(err.message)
        })
      })
      e.preventDefault();
   }
   updateError(msg){
     this.setState({error: msg})
   }
   render() {
     return (
         <form className="signIn" onSubmit={this.handleSubmit}>
          <h5 className="heading">Get money</h5>
             <div className='input-field col s12'>
               <input className='input' onChange={this.handleChange} type='text' name='first_name' id='first_name' />
               <label htmlFor='first_name'>first name</label>
             </div>
             <div className='input-field col s8'>
               <input className='input' onChange={this.handleChange} type='text' name='last_name' id='last_name' />
               <label htmlFor='last_name'>last name</label>
             </div>
             <div className='input-field col s8'>
               <input className='input' onChange={this.handleChange} type='text' name='username' id='username' />
               <label htmlFor='username'>username</label>
             </div>

             <div className='input-field col s8'>
               <input className='input' onChange={this.handleChange} type='email' name='email' id='email' />
               <label htmlFor='email'>email</label>
             </div>

             <div className='input-field col s8'>
               <input className='input' onChange={this.handleChange} type='password' name='password' id='password' />
               <label htmlFor='password'>password</label>
             </div>
           <br />
               <button type='submit' name='btn_login' className='tableButtons login'>
                create account
               </button>
             {this.state.error}
         </form>
     )
   }
 }

 export default withRouter(SignUp)
