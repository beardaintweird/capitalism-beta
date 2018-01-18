'use strict';
module.exports = (sequelize, DataTypes) => {
  var table = sequelize.define('table', {
    name: DataTypes.STRING,
    player_limit: DataTypes.INTEGER,
    playerNames: DataTypes.ARRAY(DataTypes.STRING)
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
