'use strict';
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    games_played: DataTypes.INTEGER,
    email: DataTypes.STRING,
    points: DataTypes.INTEGER,
    table_id: DataTypes.INTEGER
  });
  Player.associate = function(models){
    Player.hasOne(models.table, {foreignKey: 'id'})
  }
  return Player;
};
