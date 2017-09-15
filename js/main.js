'use strict';
const out = console.log;
out('js connected');
var Cards = App.Cards();
var Game  = App.Game();
var Db    = App.Db();
let currentPlayer = null;
let existingTables = [];

// gets number of keys in an object
function getObjectSize(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
$("#startGame").on('click', function(e){
  out($(this));
  e.preventDefault();
  out($("[type='number']").val())
  Game.numOfPlayers = parseInt($("[type='number']").val()) || 4;
  console.log(Game.numOfPlayers, parseInt($("[type='number']").val()))
  startGame();
});
$('#rulesContainer').hide();
$('#toggleRules').on('click',function(){
  if($('#rulesContainer').css('display') === 'none'){
    $('#rulesContainer').show('blind');
  } else {
    $('#rulesContainer').hide('blind');
  }
});
$('#gameContainer').hide();


$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      renderTableButtons();
      addRemoveUsersInTables();
      $('#createTable').show();
      $('#signInSignUp').hide('blind');
      $('#signOutBtn').show('blind');
      // User is signed in.
      let name  = user.displayName;
      let email = user.email;
      let uid   = user.uid;
      Db.getOnePlayer(uid, function(user){
          currentPlayer = user;
          currentPlayer.uid = uid;
          console.log(currentPlayer);
          toggleTableButtons();
          return Db.printUsername(user);
      });
      out(`name: ${name}, email: ${email}, uid: ${uid}`);
    } else {
      // No user is signed in.
      out('no user is signed in');
      $('#createTable').hide();
      $('#gameContainer').hide();
      $('#username').remove();
      $('#signInSignUp').show('blind');
      $('#signOutBtn').hide('blind');
    }
  });
})
$('#signUpBtn').on('click', function(e){
  e.preventDefault();
  $('.error').remove();

  let email = Db.getEmail();
  let password = Db.getPassword();
  let displayName = Db.getDisplayName();
  Db.createNewUser(email, password, displayName);
  Db.clearEmailAndPasswordAndUsername();
});
$('#signInBtn').on('click', function(e){
  e.preventDefault();
  let email = Db.getEmail();
  let password = Db.getPassword();
  Db.signInUser(email, password);
  Db.clearEmailAndPasswordAndUsername();
})
$('#signOutBtn').on('click', function(e){
  e.preventDefault();
  Db.signOutUser();
})

const startGame = function(){
  let deck = Cards.createDeck();
  // shuffle
  deck = Cards.shuffle(deck);
  var piles = Game.deal(deck);
  var players = Game.createPlayers();
  players = Game.assignHands(true, piles, players);
  Game.play(true, players);
}

function renderTableButtons(){
  $('#tableBtnSection').remove();
  // make the 'create table button'
  $('#formSection').append(`
        <section id="tableBtnSection">
          <div class="mx-auto">
            <button id="createTableBtn" type="button">
              Create a table
            </button>
          </div>
        </section>`);
  $('#createTableBtn').on('click',function(){
    Db.createTable(firebase.auth().currentUser, function(){
      // run this function again - to update the buttons
      renderTableButtons();
      // not sure why this is called...?
      // TODO: should be done in child_added
      addRemoveUsersInTables();
    });
    $('#createTableBtn').prop('disabled', true);
  });

  Db.getTables(function(response){
    for (let table in response){
      existingTables.push(table);
      if(response.hasOwnProperty(table)){
        // create the tables with the buttons
        if(!$(`#${table}`).length){
          $('#formSection').append(`
            <div class="table" id="${table}">
              <table>
                <thead>
                  <tr><th>${table}</th></tr>
                </thead>
                <tbody>
                </tbody>
              </table>
              <button data-id="${table}" class="joinTable">Join table</button>
              <button data-id="${table}" class="leaveTable">Leave table</button>
            </div>
            `);
            // add users to table
            for(let user in response[table]){
              if(!$(`#${response[table][user].username}`).length){
                if(user == firebase.auth().currentUser.uid){
                  console.log(`user ${user} is in table ${table}`);
                  console.log(`adding ${user} to ${table}`)
                  // highlight the name if its the logged in user
                  $(`#${table} table tbody:last-child`)
                    .append(`<tr><td id="${response[table][user].username}"><strong>${response[table][user].username}</strong></td></tr>`);
                } else {
                  console.log(`adding ${user} to ${table}`)
                  $(`#${table} table tbody:last-child`)
                    .append(`<tr><td id="${response[table][user].username}">${response[table][user].username}</td></tr>`);
                }
              }
            }
        }
      }
    }
    $('.joinTable').on('click', function(e){
      Db.joinTable($(this)[0].dataset.id, firebase.auth().currentUser, function(player){
        // turn the proper tables on, other tables off
        // REFACTOR: turn the join table buttons off
        toggleTableButtons();
        // should be done automatically by child_added
        addRemoveUsersInTables();
      });
    });
    $('.leaveTable').on('click', function(e){
      Db.leaveTable($(this)[0].dataset.id, firebase.auth().currentUser, function(player){
        // TODO: just turn off the leave table buttons
        toggleTableButtons();
        // should be done in child_removed
        addRemoveUsersInTables();
      });
    });
  });
}
function addRemoveUsersInTables(){
  console.log('here in add remove users');
  // goes through the existing tables and sets the child event listeners
  // TODO: should only be called once.
  // TODO: do it once at the beginning for all existing tables, again when a new
  // table is created
  for(let i = 0; i < existingTables.length; i++){
    Db.dbRef.child(`tables/${existingTables[i]}`).on('child_added', (res)=>{
      let user  = res.val().username;
      let table = existingTables[i];
      if(!$(`#${user}`).length){
        console.log(currentPlayer.username, res.val().username);
        if(currentPlayer.username == user){
          console.log(`user ${user} is in table ${table}`);
          console.log(`adding ${user} to ${table}`)
          $(`#${table} table tbody:last-child`)
            .append(`<tr><td id="${user}"><strong>${user}</strong></td></tr>`);
        } else {
          console.log(`adding ${user} to ${table}`)
          $(`#${table} table tbody:last-child`)
            .append(`<tr><td id="${user}">${user}</td></tr>`);
        }
      }
    });
    Db.dbRef.child(`tables/${existingTables[i]}`).on('child_removed', (res)=>{
      console.log('child removed');
      Db.getTables(function(tables){
        let doesTableExist = false;
        if(!tables) {
          $('#${existingTables[i]}').remove();
        }
        for(let table in tables){
          if(table == existingTables[i]){
            doesTableExist = true;
          }
        }
        console.log(doesTableExist);
        if(!doesTableExist){
          $(`#${existingTables[i]}`).hide('slow', function(){
            $(`#${existingTables[i]}`).remove();
          });
        }
      });
      if($(`#${res.val().username}`).length){
        $(`#${res.val().username}`).fadeOut();
        $(`#${res.val().username}`).remove();
      }
    });
  }
}
function toggleTableButtons(){
  // enables and disables table buttons based on the player having a table or not
    Db.getOnePlayer(currentPlayer.uid, function(player){
      for(let prop in player){
        if(player.hasOwnProperty(prop)){
          currentPlayer[prop] = player[prop];
        }
      }
      if(currentPlayer.hasTable){
        $('.joinTable').prop('disabled', true);
        for(let i = 0, x = $('.leaveTable'), y = x.length; i < y; i++){
          if(x[i].dataset.id == player.table){
            x[i].disabled = false;
          } else {
            x[i].disabled = true;
          }
        }
      } else {
        $('.leaveTable').prop('disabled', true);
        $('.joinTable').prop('disabled', false);
      }
    });
}
