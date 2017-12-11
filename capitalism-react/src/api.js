module.exports = {
  getUser(email){
    fetch(`http://localhost:3000/player/${email}`)
    .then(res=>res.json())
    .then((player) => {
      localStorage.setItem('user', JSON.stringify(player[0]))
    })
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
      localStorage.setItem('user', result)
    })
  }
}
