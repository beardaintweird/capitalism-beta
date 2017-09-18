'use strict';
const out = console.log;
out('js connected');
var Cards = App.Cards();
var Game = App.Game();
var Db = App.Db();
let currentPlayer = null;
let existingTables = [];
let countdown = null;

// gets number of keys in an object
function getObjectSize(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

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
        assignListeners();
        return Db.printUsername(user);
      });
    } else {
      // No user is signed in.
      out('no user is signed in');
      $('#createTable').hide();
      $('#numberOfPlayers').hide();
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


// makes the create table button
function renderCreateTableButton() {
  $('#tableBtnSection').remove();
  // make the 'create table button'
  $('#formSection').append(`
        <section id="tableBtnSection">
          <div class="mx-auto">
            <input type="number" min=4 max=8 id="numberOfPlayers">
            <button id="createTableBtn" type="button">
              Create a table
            </button>
          </div>
        </section>`);
  $('#createTableBtn').on('click', function() {
    let numberOfPlayers = $('#numberOfPlayers').val();
    Db.createTable(firebase.auth().currentUser, numberOfPlayers, null);
    $('#createTableBtn').prop('disabled', true);
    $('.joinTable').prop('disabled', true);
  });
}
function assignListeners() {
  Db.dbRef.child('tables').on('child_added', (table) => {
    let playersInTable = 0;
    renderTable(table);
    Db.dbRef.child('tables/' + table.key).child('members').on('child_added', (user) => {
      playersInTable++;
      displayNumberOfPlayers(playersInTable, table);
      renderUser(user, table);
      if(playersInTable == parseInt(table.val().numberOfPlayers)){
        $(`.joinTable[data-id='${table.key}']`).prop('disabled', true);
        startCountdown(true, table);
      }
    });
    Db.dbRef.child('tables/'+table.key).child('members').on('child_removed', (user)=>{
      playersInTable--;
      displayNumberOfPlayers(playersInTable, table);
      destroyUser(user,table);
      startCountdown(false);
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
          <tr><th>${table.key} <span class="playersInTable" data-id="${table.key}"></span></th></tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <button data-id="${table.key}" class="joinTable" disabled>Join table</button>
      <button data-id="${table.key}" class="leaveTable" disabled>Leave table</button>
    </div>
    `);

  // toggles the disabled property on the join and leave buttons
  if(currentPlayer.hasTable){
    if(table.val().members[currentPlayer.uid]){
      $(`.leaveTable[data-id='${table.key}']`).prop('disabled', false);
    }
    $('.joinTable').prop('disabled', true);
    $('#createTableBtn').prop('disabled', true);
    $('#numberOfPlayers').prop('disabled', true);
  } else {
    $('.leaveTable').prop('disabled', true);
    $('.joinTable').prop('disabled', false);
  }
  $('.joinTable').unbind().on('click', function(e) {
    let tableKey = $(this)[0].dataset.id;
    Db.joinTable(tableKey, firebase.auth().currentUser, function(){
      $('.joinTable').prop('disabled', true);
      $(`.leaveTable[data-id='${tableKey}']`).prop('disabled', false);
      $('#createTableBtn').prop('disabled', true);
      $('#numberOfPlayers').prop('disabled', true);
    });
  });
  $('.leaveTable').unbind().on('click', function(e) {
    Db.leaveTable($(this)[0].dataset.id, firebase.auth().currentUser, function(){
      $('.leaveTable').prop('disabled', true);
      $('.joinTable').prop('disabled', false);
      $('#createTableBtn').prop('disabled', false);
      $('#numberOfPlayers').prop('disabled', false);
    });
  });
}
function renderUser(user, table) {
  let username = user.val().username;
  if (user.key == firebase.auth().currentUser.uid) {
    // highlight the name if its the logged in user
    $(`#${table.key} table tbody:last-child`)
      .append(`<tr id="${username}"><td><strong>${username}</strong></td></tr>`);
  } else {
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
function displayNumberOfPlayers(num, table){
  $(`.playersInTable[data-id='${table.key}']`).html(`<strong>${num}</strong> out of 8`)
}
function startCountdown(shouldStartGame, table){
  if(shouldStartGame){
    let count = 5;
    $(`#${table.key}`).append(`<p class="countdown" data-id="${table.key}">Game starts in ${count}</p>`);
    countdown = setInterval(()=>{
      $(`.countdown[data-id='${table.key}']`).text(`Game starts in ${count}`);
      count--;
      if(count == 0){
        startGame();
        stopInterval(countdown);
      }
    }, 1000);
  } else {
    if(countdown) {
      $(`.countdown[data-id='${table.key}']`).remove();
      stopInterval(countdown);
    }
  }
}
function stopInterval(intervalFunction){
  clearInterval(intervalFunction);
  intervalFunction = undefined;
}
const startGame = function() {
  console.log(currentPlayer);
  if(currentPlayer.admin){
    console.log('Admin shuffling the cards & dealing');
    let deck = Cards.createDeck();
    // shuffle
    deck = Cards.shuffle(deck);
    var piles = Game.deal(deck);
  } else {
    // launch the rest of the players into the game
    console.log('Game starting now!!!');
  }
  // var players = Game.createPlayers();
  // players = Game.assignHands(true, piles, players);
  // Game.play(true, players);
}
