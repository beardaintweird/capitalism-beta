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
     if(localStorage.getItem('user')) {
       this.props.history.push('/')
     } else {
       // console.log(firebase.auth().currentUser);
     }
   }
   handleSubmit(e){
     let errorMessage = ''
     firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      .then(() => {
        this.props.history.push('/')
      })
      .catch((err) => {
        errorMessage = err.message
      })
      this.setState({error:errorMessage})
      e.preventDefault()
   }
   handleChange(e){
     e.target.id == 'email' ? this.setState({email:e.target.value})
      : this.setState({password:e.target.value})
   }
   render() {
     return (
       <div>
       <div className="section"></div>
         <main>
           <center>
             <div className="section"></div>

             <h5 className="indigo-text">Please, login into your account</h5>
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
                       <input className='validate' onChange={this.handleChange} type='email' name='email' id='email' />
                       <label htmlFor='email'>Enter your email</label>
                     </div>
                   </div>

                   <div className='row'>
                     <div className='input-field col s12'>
                       <input className='validate' onChange={this.handleChange} type='password' name='password' id='password' />
                       <label htmlFor='password'>Enter your password</label>
                     </div>
                     <label style={{float: 'right'}}>
                       <a className='pink-text' href='#!'><b>Forgot Password?</b></a>
                     </label>
                     <p>{this.state.error}</p>
                   </div>

                   <br />
                   <center>
                     <div className='row'>
                       <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Login</button>
                     </div>
                   </center>
                 </form>
               </div>
             </div>
             <a href="/signup">Create account</a>
           </center>

           <div className="section"></div>
           <div className="section"></div>
         </main>

       </div>
     )
   }
 }

 export default withRouter(SignIn)
