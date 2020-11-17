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
      label: {
        type: Sequelize.STRING(1000),
        unique: true,
      },
      image: Sequelize.STRING(1000),
      amount: Sequelize.STRING,
      discount_type: Sequelize.STRING,
      availability_from: Sequelize.DATE,
      availability_till: Sequelize.DATE,
      store_name: Sequelize.STRING,
      link: Sequelize.STRING(10000),
      description: Sequelize.STRING(10000),
      new_price: Sequelize.DOUBLE,
      discounted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await query.addColumn('Product', 'old_price', Sequelize.DOUBLE);
  },

  down: async (query) => {
    await query.dropColumn('Product', 'old_price');
    await query.dropTable('Product');
  },
};
