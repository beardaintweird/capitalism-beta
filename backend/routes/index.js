const express = require('express');
const router = express.Router();
const db      = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('express connected');
});

// add player
router.post('/player', (req,res,next) => {
  db.Player.create(req.body)
    .then((player) => {
      res.json(player)
    }).catch(err=>res.status(500).json(err))
})
// Add points
router.post('/points', (req,res,next) => {
  db.Player.findById(req.body.id)
    .then((player) => {
      console.log("player",player);
      return db.Player.update({"points":req.body.points + player.dataValues.points}, {
          where: { "id":req.body.id}
        })
    })
    .then((updated_player) => {
      res.json(updated_player)
    }).catch(err=>res.status(500).json(err))
})
// update games played
router.post('/games_played', (req,res,next) => {
  db.Player.findById(req.body.id)
  .then((player) => {
    return db.Player.update({"games_played": player.dataValues.games_played + 1}, {
      where: { "id":player.dataValues.id}
    })
  })
    .then((player) => {
      res.json(player)
    }).catch(err=>res.status(500).json(err))
})


module.exports = router;
