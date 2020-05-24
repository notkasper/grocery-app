/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Sequelize = require('sequelize');
const uuid = require('uuid');

module.exports = {
  up: async (query) => {
    await query.dropTable('List');
    await query.createTable('List', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      owner: Sequelize.UUID,
      items: Sequelize.ARRAY(Sequelize.JSON),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    const users = await query.sequelize.models.User.findAll({ where: {} });
    for (const user of users) {
      await query.sequelize.models.List.create({
        id: uuid.v4(),
        owner: user.id,
        items: [],
      });
    }
  },

  down: async () => {},
};
