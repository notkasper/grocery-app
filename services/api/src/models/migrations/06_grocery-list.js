const Sequelize = require('sequelize');

module.exports = {
  up: async (query) => {
    await query.createTable('List', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      owner: Sequelize.UUID,
      items: Sequelize.ARRAY(Sequelize.UUID),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (query) => {
    await query.dropTable('List');
  },
};
