'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product);
      User.hasMany(models.Order);
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      role: DataTypes.STRING,
      img: DataTypes.STRING,
      loc_address: DataTypes.STRING,
      loc_lat: DataTypes.FLOAT,
      loc_lng: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
