module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      firebase_uid: {
        type: DataTypes.STRING,
        unique: true,
      },
      favorites: DataTypes.ARRAY(DataTypes.UUID),
    },
    { freezeTableName: true }
  );

  return User;
};
