module.exports = {
  getUser(email){
    return fetch(`http://localhost:3000/player/${email}`)
    .then(res=>res.json())
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
      for(let key in result){
        localStorage.setItem(key, result[key]);
        console.log(key,result[key]);
      }
      // localStorage.setItem('user', result)
    })
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
