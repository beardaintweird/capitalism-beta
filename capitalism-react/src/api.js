module.exports = {
  getUser(email){
    return fetch(`http://localhost:3000/player/${email}`)
    .then(res=>res.json())
  },
  getUserViaUsername(username){

  },
  createUser(first_name, last_name, username, email){
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: first_name + ' ' + last_name,
        username: username,
        games_played: 0,
        points: 0,
        table_id: null,
        email: email
      })
    }
    fetch('http://localhost:3000/player', options)
    .then(res=>res.json())
    .then(result=> {
      console.log(result);
    })
  },
  updateGameUnderway(table_id,game_underway){
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        table_id: table_id,
        game_underway: game_underway
      })
    }
    fetch('http://localhost:3000/table/game_underway', options)
    .then(res=>res.json())
    .then(result=> {
      console.log('game_underway update result:',result);
    })
  },
  getTablePlayers(table_id){
    return fetch('http://localhost:3000/table/'+table_id)
            .then(res=>res.json())
  },
  leaveTable(player_id,table_id){
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: player_id,
        table_id: table_id
      })
    }
    return fetch('http://localhost:3000/table/leave',options)
            .then(res=>res.json())
  },
  updateTimer(player_id){

  },
  objectKeys(){
    return {
      id:'id',
      email: 'email',
      games_played: 'games_played',
      name: 'name',
      points: 'points',
      table_id: 'table_id',
      username: 'username'
    }
  }
}
