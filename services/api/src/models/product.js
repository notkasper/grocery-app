module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      category: DataTypes.UUID,
      label: {
        type: DataTypes.STRING(1000),
        unique: true,
      },
      image: DataTypes.STRING(1000),
      amount: DataTypes.STRING,
      discount_type: DataTypes.STRING,
      availability_from: DataTypes.DATE,
      availability_till: DataTypes.DATE,
      store_name: DataTypes.STRING,
      link: DataTypes.STRING(10000),
      description: DataTypes.STRING(10000),
      new_price: DataTypes.DOUBLE,
      old_price: DataTypes.DOUBLE,
      discounted: DataTypes.BOOLEAN,
    },
    { freezeTableName: true }
  );

  return Product;
};
