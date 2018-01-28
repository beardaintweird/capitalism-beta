'use strict';
module.exports = (sequelize, DataTypes) => {
  var table = sequelize.define('table', {
    name: DataTypes.STRING,
    player_limit: DataTypes.INTEGER,
    playerNames: DataTypes.ARRAY(DataTypes.STRING),
    playedCards: DataTypes.JSON,
    playersInGame: DataTypes.JSON,
    isDoublesOnly: DataTypes.BOOLEAN,
    isTriplesOnly: DataTypes.BOOLEAN,
    game_underway: DataTypes.BOOLEAN
  },{
    freezeTableName:true
  });
  table.associate = function(models){
    table.hasMany(models.player, {
      foreignKey: 'table_id'
    })
  }
  return table;
};
