const Joi = require('joi');

const { Order, Product, OrderProduct } = require('../../models');

exports.getOrderByPartnerId = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'user',
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
    console.log(err);
  }
};

exports.getOrderByCustomerId = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'user',
        },
      ],
      where: {
        customerId: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    console.log(err);
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
          as: 'product',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'user',
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
    console.log(err);
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      products: Joi.array().items(
        Joi.object({
          quantity: Joi.number().min(0),
        })
      ),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'Invalid',
        message: error.details.message[0],
      });
    }

    // Get all products id.
    let productsId = [];
    for (let i = 0; i < body.length; i++) {
      productsId.push(body[i].id);
    }

    const products = await Product.findOne({
      where: {
        id: {
          [Op.or]: productsId,
        },
      },
    });

    if (products.length < 1 || products.length !== body.length) {
      return res.send({
        status: 'Order denied.',
        message: "Some from your product doesn't exist.",
      });
    }

    // Check if products come from a same partner.
    const partnerId = products[0].userId;
    for (let i = 1; i < products.length; i++) {
      if (partnerId !== products[i].userId) {
        return res.send({
          status: 'Order denied.',
          message: 'Customer only can order the menu from a same place.',
        });
      }
    }

    // Create order.
    const order = await Order.create({
      status: 'Approval',
      customerId: parseInt(user.id),
      partnerId,
    });

    // Create bulk array for order product.
    let bulk = [];
    for (let i = 0; i < products.length; i++) {
      bulk.push({
        quantity: body[i].quantity,
        productId: body[i].id,
        orderId: order.id,
      });
    }

    await OrderProduct.bulkCreate(body);

    // Get user who order.
    const customer = await User.findOne({
      where: {
        id: parseInt(user.id),
      },
    });

    const orderData = await Order.findOne({
      include: {
        model: 'Product',
        as: 'Products',
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
    console.log(err);
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
        status: 'Invalid',
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
  } catch (err) {}
};

exports.deleteOrder = async (req, res) => {};
try {
  const { params } = req;
  const { id } = params;

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
} catch (err) {}
