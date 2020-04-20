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
      availability: DataTypes.STRING,
      link: DataTypes.STRING,
      new_price: DataTypes.NUMBER,
    },
    {
      freezeTableName: true,
    }
  );

  return Product;
};
