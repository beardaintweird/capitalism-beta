'use strict';
module.exports = (sequelize, DataTypes) => {
  var player = sequelize.define('player', {
    name: DataTypes.STRING,
    hand: DataTypes.JSON,
    email: DataTypes.STRING,
    timer: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    isTurn: DataTypes.BOOLEAN,
    isDone: DataTypes.BOOLEAN,
    ranking: DataTypes.STRING,
    username: DataTypes.STRING,
    table_id: DataTypes.INTEGER,
    games_played: DataTypes.INTEGER,
    previousRanking: DataTypes.STRING
  },{
    freezeTableName: true
  });
  player.associate = function(models){
    player.hasOne(models.table, {foreignKey: 'id'})
  }
  return player;
};
