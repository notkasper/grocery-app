module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      label: DataTypes.STRING,
    },
    { freezeTableName: true }
  );

  return Category;
};
