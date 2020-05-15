const Sequelize = require('sequelize');

module.exports = {
  up: async (query) => {
    await query.createTable('User', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      firebase_uid: {
        type: Sequelize.STRING,
        unique: true,
      },
      favorites: Sequelize.ARRAY(Sequelize.UUID),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await query.createTable('Favorite', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      user_id: Sequelize.UUID,
      category_id: Sequelize.UUID,
      term: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (query) => {
    await query.dropTable('User');
    await query.dropTable('Favorite');
  },
};
