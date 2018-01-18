'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('table', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      player_limit: {
        type: Sequelize.INTEGER
      },
      playerNames: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      game_underway: {
        type: Sequelize.BOOLEAN
      },
      playersInGame: {
        type: Sequelize.JSON
      },
      playedCards: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('table');
  }
};
