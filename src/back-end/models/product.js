module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      category: DataTypes.UUID,
      label: DataTypes.STRING,
      image: DataTypes.STRING,
      amount: DataTypes.STRING,
      discount_type: DataTypes.STRING,
      availability_from: DataTypes.DATE,
      availability_till: DataTypes.DATE,
      store_name: DataTypes.STRING,
      link: DataTypes.STRING(1000),
      new_price: DataTypes.NUMBER,
      discounted: DataTypes.BOOLEAN,
    },
    { freezeTableName: true }
  );

  return Product;
};
