'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User);
      Order.belongsToMany(models.Product, {
        through: {
          model: 'OrderProduct',
        },
      });
    }
  }
  Order.init(
    {
      status: DataTypes.STRING,
      loc_address: DataTypes.STRING,
      loc_lat: DataTypes.FLOAT,
      loc_lng: DataTypes.FLOAT,
      customerId: DataTypes.INTEGER,
      partnerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
