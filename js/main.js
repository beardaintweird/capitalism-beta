'use strict';
const out = console.log;
out('js connected');
var Cards = App.Cards();
var Game = App.Game();
var Db = App.Db();
let currentPlayer = null;
let existingTables = [];

// gets number of keys in an object
function getObjectSize(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
$("#startGame").on('click', function(e) {
  out($(this));
  e.preventDefault();
  out($("[type='number']").val())
  Game.numOfPlayers = parseInt($("[type='number']").val()) || 4;
  console.log(Game.numOfPlayers, parseInt($("[type='number']").val()))
  startGame();
});
$('#rulesContainer').hide();
$('#toggleRules').on('click', function() {
  if ($('#rulesContainer').css('display') === 'none') {
    $('#rulesContainer').show('blind');
  } else {
    $('#rulesContainer').hide('blind');
  }
});
$('#gameContainer').hide();


$(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      renderCreateTableButton();
      $('#signInSignUp').hide('blind');
      $('#signOutBtn').show('blind');
      // User is signed in.
      let name = user.displayName;
      let email = user.email;
      let uid = user.uid;
      Db.getOnePlayer(uid, function(user) {
        currentPlayer = user;
        currentPlayer.uid = uid;
        console.log(currentPlayer);
        assignListeners();
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
$('#signUpBtn').on('click', function(e) {
  e.preventDefault();
  $('.error').remove();

  let email = Db.getEmail();
  let password = Db.getPassword();
  let displayName = Db.getDisplayName();
  Db.createNewUser(email, password, displayName);
  Db.clearEmailAndPasswordAndUsername();
});
$('#signInBtn').on('click', function(e) {
  e.preventDefault();
  let email = Db.getEmail();
  let password = Db.getPassword();
  Db.signInUser(email, password);
  Db.clearEmailAndPasswordAndUsername();
})
$('#signOutBtn').on('click', function(e) {
  e.preventDefault();
  Db.signOutUser();
})
const startGame = function() {
  let deck = Cards.createDeck();
  // shuffle
  deck = Cards.shuffle(deck);
  var piles = Game.deal(deck);
  var players = Game.createPlayers();
  players = Game.assignHands(true, piles, players);
  Game.play(true, players);
}
// makes the create table button
function renderCreateTableButton() {
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
  $('#createTableBtn').on('click', function() {
    Db.createTable(firebase.auth().currentUser, null);
    $('#createTableBtn').prop('disabled', true);
    $('.joinTable').prop('disabled', true);
  });
}

function assignListeners() {
  Db.dbRef.child('tables').on('child_added', (table) => {
    renderTable(table);
    Db.dbRef.child('tables/' + table.key).on('child_added', (user) => {
      renderUser(user, table);
    });
    Db.dbRef.child('tables/'+table.key).on('child_removed', (user)=>{
      destroyUser(user,table);
    })
  });
  Db.dbRef.child('tables').on('child_removed', (table)=>{
    destroyTable(table);
  })
}

function renderTable(table) {
  // creates the table
  $('#formSection').append(`
    <div class="table" id="${table.key}">
      <table>
        <thead>
          <tr><th>${table.key}</th></tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <button data-id="${table.key}" class="joinTable" disabled>Join table</button>
      <button data-id="${table.key}" class="leaveTable" disabled>Leave table</button>
    </div>
    `);

  // toggles the disabled property on the join and leave buttons
  console.log('current player has table', currentPlayer.hasTable);
  if(currentPlayer.hasTable){
    if(table.val()[currentPlayer.uid]){
      $(`.leaveTable[data-id='${table.key}']`).prop('disabled', false);
    }
    $('.joinTable').prop('disabled', true);
    $('#createTableBtn').prop('disabled', true);
  } else {
    $('.leaveTable').prop('disabled', true);
    $('.joinTable').prop('disabled', false);
  }

  $('.joinTable').unbind().on('click', function(e) {
    let tableKey = $(this)[0].dataset.id;
    Db.joinTable(tableKey, firebase.auth().currentUser, function(){
      $('.joinTable').prop('disabled', true);
      $(`.leaveTable[data-id='${tableKey}']`).prop('disabled', false);
    });
  });
  $('.leaveTable').unbind().on('click', function(e) {
    Db.leaveTable($(this)[0].dataset.id, firebase.auth().currentUser, function(){
      $('.leaveTable').prop('disabled', true);
      $('.joinTable').prop('disabled', false);
      $('#createTableBtn').prop('disabled', false);
    });
  });
}
function renderUser(user, table) {
  let username = user.val().username;
  if (user.key == firebase.auth().currentUser.uid) {
    console.log(`adding ${username} to ${table.key}`)
    // highlight the name if its the logged in user
    $(`#${table.key} table tbody:last-child`)
      .append(`<tr id="${username}"><td><strong>${username}</strong></td></tr>`);
  } else {
    console.log(`adding ${username} to ${table.key}`)
    $(`#${table.key} table tbody:last-child`)
      .append(`<tr id="${username}"><td >${username}</td></tr>`);
  }
}
function destroyUser(user,table){
  let username = user.val().username;
  console.log(`Removing ${username} from ${table.key}`)
  $(`#${username}`).fadeOut(300, function() { $(this).remove(); });
}
function destroyTable(table){
  console.log('removing table:',table.key);
  $(`#${table.key}`).fadeOut(300, function() { $(this).remove(); });
}
