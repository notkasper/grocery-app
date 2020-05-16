module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    'Favorite',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      user_id: DataTypes.UUID,
      category_id: DataTypes.UUID,
      term: DataTypes.STRING,
    },
    { freezeTableName: true }
  );

  return Favorite;
};
