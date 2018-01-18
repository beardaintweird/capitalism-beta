const express = require('express');
const router = express.Router();
const db      = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('express connected');
});
// get player
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
      if(!table.players) table.players = [req.body.player]
      else {
        let player_exists = false;
        let matched_names = table.players.filter((playerName) => {
          return req.body.player == playerName
        })
        player_exists = matched_names.length ? true : false;
        if(player_exists) res.json('player already in table');
        table.players.push(req.body.player)
      }
      console.log('after push');
      return table.update({
        players: table.players
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
    table.players = table.players.filter((player) => {
      return player != req.body.username
    })
    return db.table.update({players: table.players},
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
  db.table.findById(req.params.id)
  .then((table) => {
    res.json(table)
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


module.exports = router;
