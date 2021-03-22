const Joi = require('joi');
const { Op } = require('sequelize');

const { Order, Product, OrderProduct, User } = require('../../models');

exports.getOrderByPartnerId = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'customer',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'partner',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
      where: {
        partnerId: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.getOrderByCustomerId = async (req, res) => {
  try {
    const { user } = req;

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'customer',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'partner',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
      where: {
        customerId: parseInt(user.id),
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'customer',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'partner',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      products: Joi.array().items(
        Joi.object({
          id: Joi.number().required(),
          quantity: Joi.number().min(0).required(),
        })
      ),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Get all products id.
    let productsId = [];
    for (let i = 0; i < body.products.length; i++) {
      productsId.push(body.products[i].id);
    }

    const products = await Product.findAll({
      where: {
        id: {
          [Op.or]: productsId,
        },
      },
    });

    if (products.length < 1 || products.length !== body.products.length) {
      return res.send({
        status: 'invalid',
        message: "Some from your product doesn't exist.",
      });
    }

    // Check if products come from a same partner.
    const partnerId = products[0].userId;
    for (let i = 1; i < products.length; i++) {
      if (partnerId !== products[i].userId) {
        return res.send({
          status: 'invalid',
          message: 'Customer only can order the menu from a same place.',
        });
      }
    }

    // Create order.
    const order = await Order.create({
      status: 'Approval',
      customerId: user.id,
      partnerId: partnerId,
    });

    // Create bulk array for order product.
    let bulk = [];
    for (let i = 0; i < products.length; i++) {
      bulk.push({
        quantity: body.products[i].quantity,
        productId: body.products[i].id,
        orderId: order.id,
      });
    }

    await OrderProduct.bulkCreate(bulk);

    // Get user who order.
    const customer = await User.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: parseInt(user.id),
      },
    });

    const orderData = await Order.findOne({
      include: {
        model: Product,
        as: 'products',
        through: {
          model: OrderProduct,
          as: 'orderProduct',
        },
      },
      where: {
        id: order.id,
      },
    });

    return res.send({
      status: 'success',
      message: 'Your order is success.',
      data: {
        transaction: {
          id: order.id,
          userOrder: customer,
          order: orderData,
        },
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { body, params } = req;
    const { status } = body;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      status: Joi.string().min(1).max(255),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    const order = await Order.update(
      {
        status,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    );

    res.send({
      status: 'success',
      message: 'Your order has been updated.',
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { params, user } = req;
    const { id } = params;

    const order = await Order.findOne({
      where: {
        id,
      },
    });

    if (order.partnerId !== parseInt(user.id)) {
      return res.send({
        status: 'Access Denied',
        message: "You don't have right to access.",
      });
    }

    await Order.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      message: 'Your order has been deleted.',
      data: {
        id,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};
