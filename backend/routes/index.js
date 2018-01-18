const express = require('express');
const router = express.Router();
const db      = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('express connected');
});

/*
==========PLAYER ROUTES==========
*/
// get player via email
router.get('/player/:email', (req,res,next) => {
  db.player.findAll({
    where: {
      email: req.params.email
    }
  })
    .then((player) => {
      res.json(player)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// get player via username
router.get('/player/:username', (req,res,next) => {
  db.player.findAll({
    where: {
      username: req.params.username
    }
  })
    .then((player) => {
      res.status(200).json(player)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// add player
router.post('/player', (req,res,next) => {
  /*
  Request format:
  {
    "name": "Samee Khan",
    "username": "beardaintweird",
    "games_played": 0,
    "points": 0,
    "table_id": null
  }
  */
  db.player.create(req.body)
    .then((player) => {
      res.json(player)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})

// Add points
router.post('/points', (req,res,next) => {
  /*
  Request format:
  {
    "points": 2,
  }
  */
  db.player.findById(req.body.id)
    .then((player) => {
      console.log("player",player);
      return db.player.update({"points":req.body.points + player.dataValues.points}, {
          where: { "id":req.body.id}
        })
    })
    .then((updated_player) => {
      res.json(updated_player)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// update games played
router.post('/games_played', (req,res,next) => {
  /*
  Request format:
  {

  }
  */
  db.player.findById(req.body.id)
  .then((player) => {
    return db.player.update({"games_played": player.dataValues.games_played + 1}, {
      where: { "id":player.dataValues.id}
    })
  })
    .then((player) => {
      res.json(player)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})

/*
==========TABLE ROUTES==========
*/
// Get tables
router.get('/table', (req,res,next) => {
  db.table.findAll({
    include: [{
      model: db.player
    }]
  })
    .then((tables) => {
      console.log(tables);
      res.json(tables)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// Get one table
router.get('/table/:id', (req,res,next) => {
  db.table.findById(req.params.id, {
    include: [{
      model: db.player,
      attributes: ['username',
        'hand','isTurn','isDone','ranking','previousRanking']
    }]
  })
  .then((table) => {
    res.json(table)
  }).catch(err=>{
    console.log(err);
    res.status(500)
  })
})
// Add table
router.post('/table', (req,res,next) => {
  /*
  Request format:
  {
    "name": "champsOnly",
    "player_limit": 6
  }
  */
  db.table.create(req.body)
    .then((table) => {
      res.json(table)
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// Add player to table
router.post('/table/addPlayer', (req,res,next) => {
  /*
  Request format:
  {
    "table_id": 1234,
    "player": "Beardaintweird",
    "player_id": 1
  }
  */
  console.log(req.body);
  db.table.findById(req.body.table_id, {
    attributes: ['id','name','players']
  })
    .then((table) => {
      if(!table.playerNames) table.playerNames = [req.body.player]
      else {
        let player_exists = false;
        table.playerNames.map((playerName) => {
          player_exists = playerName === req.body.player ? true : false
        })
        if(player_exists) return res.json('player already in table');
        table.playerNames.push(req.body.player)
      }
      console.log('after push');
      return table.update({
        playerNames: table.playerNames
      },{
        where: {
          id: req.body.table_id
        }
      })
    })
    .then((table) => {
      return db.player.update({
        table_id: req.body.table_id
      }, {
        where: {
          id: req.body.player_id
        }
      })
    })
    .then((player) => {
      if(player) res.json("shuccess")
    }).catch(err=>{
      console.log(err);
      res.status(500)
    })
})
// update game_underway
router.post('/table/game_underway', (req,res,next) => {
  /*
  Request format:
  {
    "table_id": 1234,
    "game_underway": true/false
  }
  */
  console.log(req.body);
  db.table.update({game_underway: req.body.game_underway},{
    where: {
      "id":req.body.table_id
    }
  })
  .then((result) => {
    console.log('UPDATE /table/game_underway',result);
    res.status(200).json('game_underway updated successfully')
  })
  .catch(err=>{
    console.log(err);
    res.status(500)
  })
})

// leave table
router.post('/table/leave', (req,res,next) => {
  /*
  {
    player_id: 1234,
    table_id: 123
  }
  */
  console.log(req.body);
  db.player.update({table_id: null}, {
    where: {
      "id":req.body.player_id
    }
  })
  .then((res) => {
    console.log(res);
    return db.table.findById(req.body.table_id)
  })
  .then((table) => {
    table.playerNames = table.playerNames.filter((player) => {
      return player != req.body.username
    })
    return db.table.update({playerNames: table.playerNames},
    {
      where: {
        id: table.id
      }
    })
  })
  .then((result) => {
    res.json(result)
  }).catch(err=>{
    console.log(err);
    res.status(500)
  })
})


module.exports = router;
