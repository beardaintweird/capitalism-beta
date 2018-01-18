'use strict';
module.exports = (sequelize, DataTypes) => {
  var player = sequelize.define('player', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    games_played: DataTypes.INTEGER,
    email: DataTypes.STRING,
    points: DataTypes.INTEGER,
    table_id: DataTypes.INTEGER
  },{
    freezeTableName: true
  });
  player.associate = function(models){
    player.hasOne(models.table, {foreignKey: 'id'})
  }
  return player;
};
