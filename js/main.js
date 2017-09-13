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
  $('#formSection').append(`
        <section id="tableBtnSection">
          <div class="mx-auto">
            <button id="tableBtn" type="button">
              Create a table
            </button>
          </div>
        </section>`);
  $('#tableBtn').on('click',function(){
    Db.createTable(firebase.auth().currentUser);
    renderTableButtons();
    $('#tableBtn').prop('disabled', true);
  });

  let count = 0;
  Db.getTables(function(response){
    for (let table in response){
      existingTables.push(table);
      if(response.hasOwnProperty(table)){
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
            for(let user in response[table]){
              if(!$(`#${response[table][user].username}`).length){
                if(user == firebase.auth().currentUser.uid){
                  console.log(`user ${user} is in table ${table}`);
                  console.log(`adding ${user} to ${table}`)
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
    addRemoveUsersInTables();
    $('.joinTable').on('click', function(e){
      Db.joinTable($(this)[0].dataset.id, firebase.auth().currentUser, function(player){
        toggleTableButtons();
      });
    });
    $('.leaveTable').on('click', function(e){
      Db.leaveTable($(this)[0].dataset.id, firebase.auth().currentUser, function(player){
        toggleTableButtons();
      });
    });
  });
}
function addRemoveUsersInTables(){
  for(let i = 0; i < existingTables.length; i++){
    Db.dbRef.child(`tables/${existingTables[i]}`).on('child_added', (res)=>{
      let user  = res.val().username;
      let table = existingTables[i];
      if(!$(`#${user}`).length){
        console.log(currentPlayer.uid, firebase.auth().currentUser.uid)
        if(currentPlayer.uid == firebase.auth().currentUser.uid){
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
      if($(`#${res.val().username}`).length){
        $(`#${res.val().username}`).fadeOut();
        $(`#${res.val().username}`).remove();
      }
    });
  }
}
function toggleTableButtons(){
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
