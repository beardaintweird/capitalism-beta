// 'use strict';
var Db = (function(){
  return {
    dbRef: firebase.database().ref(),
    playerList: null,
    getPlayerList(callback){
      // add authentication later
      this.dbRef.child('players').once('value').then(function(res){
        if(callback) callback(res);
        playerList = res;
      })
    },
    getOnePlayer(uid, callback){
      let player = null;
      this.dbRef.child('players').child(uid).once('value').then(function(res){
        player = res.val();
        if(callback) callback(player);
      });
      return player;
    },
    getTables(callback){
      let response = null;
      this.dbRef.child('tables').once('value').then(function(res){
        response = res.val();
        if(callback) callback(response);
      });
      return response;
    },
    createPlayer(playerId, username, email){
      this.dbRef.child('players').child(playerId).set({
          'username' : username,
          'email'    : email
      });
    },
    createTable(user, callback){
      let tablesRef = this.dbRef.child('tables');
      let newTableKey = tablesRef.push().key;
      this.joinTable(newTableKey, user, callback);
    },
    joinTable(key, user, callback){
      this.getOnePlayer(user.uid, function(res){
        this.Db.dbRef.child('tables').child(key).update({
          [user.uid] : {
            'username': res.username
          }
        });
        this.Db.dbRef.child('players').child(user.uid).update({
          hasTable: true,
          table: key
        });
        if(callback) callback(res);
      });
    },
    leaveTable(key,user, callback){
      this.getOnePlayer(user.uid, function(res){
        this.Db.dbRef.child('tables').child(key).update({
          [user.uid]: null
        });
        this.Db.dbRef.child('players').child(user.uid).update({
          hasTable: false,
          table: null
        });
        if(callback) callback(res);
      });
    },
    createNewUser(email, password, name){
      if(email && name){
        if(password){
          firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            this.Db.createPlayer(user.uid, name, email);
          }, function(error){
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            $('#signInSignUp').append(`<p class="error">Uh-oh: ${errorMessage}</p>`);
          });
        } else {
          return $('#signInSignUp').append(`<p class="error">please enter your password</p>`);
        }
      } else {
        return $('#signInSignUp').append(`<p class="error">please enter your email/username</p>`);
      }
    },
    signInUser(email, password){
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $('.error').remove();
        $('#signInSignUp').append(`<p class="error">Uh-oh: ${errorMessage}</p>`);
        // ...
      });
    },
    signOutUser(){
      firebase.auth().signOut();
    },
    getDisplayName(){
      let name = $('#displayNameInput').val();
      return name;
    },
    getEmail(){
      let email = $('#emailInput').val();
      return email;
    },
    getPassword(){
      let password = $('#passwordInput').val();
      return password;
    },
    clearEmailAndPasswordAndUsername(){
      $('#emailInput').val('');
      $('#passwordInput').val('');
      $('#displayNameInput').val('');
    },
    getTotalNumOfPlayers(data){
      return Object.size(data.val());
    },
    printUsername(user){
      $('#formSection').prepend(`<h1 id="username">Welcome, ${user.username} :)</h1>`).hide().fadeIn('slow');
    }
  }
})();
