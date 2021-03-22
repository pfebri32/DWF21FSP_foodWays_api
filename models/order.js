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
      Order.belongsTo(models.User, {
        as: 'customer',
        foreignKey: 'customerId',
      });
      Order.belongsTo(models.User, {
        as: 'partner',
        foreignKey: 'partnerId',
      });
      Order.belongsToMany(models.Product, {
        as: 'products',
        foreignKey: 'orderId',
        through: {
          model: 'OrderProduct',
          as: 'orderProduct',
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
