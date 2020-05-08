const Sequelize = require('sequelize');

module.exports = {
  up: async (query) => {
    await query.dropTable('Product');
    await query.createTable('Product', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      category: Sequelize.UUID,
      label: Sequelize.STRING(1000),
      image: Sequelize.STRING(1000),
      amount: Sequelize.STRING,
      discount_type: Sequelize.STRING,
      availability_from: Sequelize.DATE,
      availability_till: Sequelize.DATE,
      store_name: Sequelize.STRING,
      link: Sequelize.STRING(10000),
      description: Sequelize.STRING(10000),
      old_price: Sequelize.DECIMAL(10, 2),
      new_price: Sequelize.DECIMAL(10, 2),
      discounted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (query) => {
    await query.dropTable('Product');
  },
};
