import React, {Component} from 'react';
import './SignUp.css';

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
       <div>
       <div className="section"></div>
         <main>
           <center>
             <div className="section"></div>

             <h5 className="indigo-text">Join the movement</h5>
             <div className="section"></div>

             <div className="container">
               <div className="z-depth-1 grey lighten-4 row" style={{display: 'inline-block', paddingTop: 32,paddingRight: 48,paddingBottom: 0,paddingLeft: 48}}>

                 <form className="col s12" onSubmit={this.handleSubmit}>
                   <div className='row'>
                     <div className='col s12'>
                     </div>
                   </div>
                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='text' name='first_name' id='first_name' />
                       <label htmlFor='first_name'>Enter your first name</label>
                     </div>
                   </div>
                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='text' name='last_name' id='last_name' />
                       <label htmlFor='last_name'>Enter your last name</label>
                     </div>
                   </div>
                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='text' name='username' id='username' />
                       <label htmlFor='username'>Enter your username</label>
                     </div>
                   </div>

                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='email' name='email' id='email' />
                       <label htmlFor='email'>Enter your email</label>
                     </div>
                   </div>

                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='password' name='password' id='password' />
                       <label htmlFor='password'>Enter your password</label>
                     </div>
                   </div>
                   <br />
                   <center>
                     <div className='row'>
                       <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Create Account</button>
                     </div>
                     {this.state.error}
                   </center>
                 </form>
               </div>
             </div>
           </center>

           <div className="section"></div>
           <div className="section"></div>
         </main>
       </div>
     )
   }
 }

 export default withRouter(SignUp)
