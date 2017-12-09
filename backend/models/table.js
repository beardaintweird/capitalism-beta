'use strict';
module.exports = (sequelize, DataTypes) => {
  var table = sequelize.define('table', {
    name: DataTypes.STRING,
    player_limit: DataTypes.INTEGER,
    players: DataTypes.ARRAY(DataTypes.STRING)
  });
  table.associate = function(models){
    table.hasMany(models.Player, {
      foreignKey: 'table_id'
    })
  }
  return table;
};
