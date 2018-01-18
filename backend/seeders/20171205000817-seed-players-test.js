'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('player', [
      {
        name: 'Samee Ahmad Khan',
        username: 'Beardaintweird',
        games_played: 0,
        points: 0,
        table_id: 1,
        email: 'samee@vt.edu',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sam K',
        username: 'whatbeard',
        games_played: 0,
        points: 0,
        table_id: 1,
        email: 'test@testing.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Schmitty Schmitter',
        username: 'schmittyisdabomb',
        games_played: 0,
        points: 0,
        table_id: 1,
        email: 'schmitty@test.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Trollbot Tobllort',
        username: 'trolololol',
        games_played: 0,
        points: 0,
        table_id: 1,
        email: 'troll@test.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('player', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
