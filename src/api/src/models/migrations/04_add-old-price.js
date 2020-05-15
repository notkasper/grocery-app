const Sequelize = require('sequelize');

module.exports = {
  up: async (query) => {
    await query.addColumn('Product', 'old_price', Sequelize.DOUBLE);
  },

  down: async (query) => {
    await query.dropColumn('Product', 'old_price');
  },
};
