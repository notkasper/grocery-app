const Sequelize = require('sequelize');

// All migrations must provide a `up` and `down` async functions

module.exports = {
  // `query` was passed in the `index.js` file
  up: async (query) => {
    await query.createTable('Product', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      category: Sequelize.UUID,
      label: Sequelize.STRING,
      image: Sequelize.STRING,
      amount: Sequelize.STRING,
      discount_type: Sequelize.STRING,
      availability_from: Sequelize.DATE,
      availability_till: Sequelize.DATE,
      link: Sequelize.STRING(1000),
      new_price: Sequelize.DOUBLE,
      discounted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await query.createTable('Category', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      label: Sequelize.STRING,
      image: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (query) => {
    await query.dropTable('Product');
  },
};
