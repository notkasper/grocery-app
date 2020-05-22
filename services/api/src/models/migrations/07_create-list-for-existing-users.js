/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Sequelize = require('sequelize');
const uuid = require('uuid');

module.exports = {
  up: async (query) => {
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
