module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define(
    'List',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      owner: DataTypes.UUID,
      items: DataTypes.ARRAY(DataTypes.UUID),
    },
    { freezeTableName: true }
  );

  return List;
};
