import React, {Component} from 'react';
import './SignIn.css';

import {withRouter} from 'react-router-dom';
import { getUser } from './../api';
import firebase from './../firebase';

class SignIn extends Component {
   constructor(props){
     super(props);
     this.state = {
       email: '',
       password: '',
       error: ''
     }
     this.handleSubmit = this.handleSubmit.bind(this)
     this.handleChange = this.handleChange.bind(this)
   }
   componentDidMount(){

   }
   handleSubmit(e){
     let errorMessage = ''
     firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      .then((user) => {
        this.props.history.push('/')
      })
      .catch((err) => {
        errorMessage = err.message
      })
      this.setState({error:errorMessage})
      e.preventDefault()
   }
   handleChange(e){
     e.target.id === 'email' ? this.setState({email:e.target.value})
      : this.setState({password:e.target.value})
   }
   render() {
     return (
       <div>
         <form className="signIn" onSubmit={this.handleSubmit}>
          <h5 className="heading">Capitalism</h5>

           <div className='input-field col s8'>
             <input className='input' onChange={this.handleChange} type='email' name='email' id='email' />
             <label htmlFor='email'>
              {this.state.email ? '' : 'email'}
             </label>
           </div>
           <div className='input-field col s8'>
             <input className='' onChange={this.handleChange} type='password' name='password' id='password' />
             <label htmlFor='password' className="input">
              {this.state.password ? '' : 'password'}
             </label>
           </div>
           <p>{this.state.error}</p>
           <button type='submit' name='btn_login' className='tableButtons login'>sign in</button><br/>
           <label>
             <a className='otherText' href='#!'><b>Forgot Password?</b></a>
           </label>
         </form>
         <a className="otherText" href="/signup">Create account</a>
       </div>
     )
   }
 }

 export default withRouter(SignIn)
