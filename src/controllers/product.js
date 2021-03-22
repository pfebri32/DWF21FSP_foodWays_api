const Joi = require('joi');
const { Op } = require('sequelize');

const { User, Product } = require('../../models');

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt',
            'img',
            'gender',
            'role',
          ],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      data: product,
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Required auth as middleware.
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      price: Joi.number().min(0).required(),
      img: Joi.string().max(255).allow(null, ''),
    });

    const { error } = schema.validate(body);
    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    const product = await Product.create({
      ...body,
      userId: user.id,
    });

    const productData = await Product.findOne({
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
      where: {
        id: product.id,
      },
    });

    return res.send({
      status: 'success',
      message: 'Product has been added.',
      data: {
        productData,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
      attributes: {
        exlclude: ['userId', 'UserId'],
      },
    });

    res.send({
      status: 'success',
      data: products,
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.getProductsByPartnerId = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.findAll({
      where: {
        userId: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      data: products,
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Required Auth and Upload middleware.
    const { user, body, params, files } = req;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      price: Joi.number().min(0).required(),
      img: Joi.string().max(255).allow(null, ''),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Update product.
    const product = await Product.update(
      {
        ...body,
        img: files[0].fileName,
      },
      {
        where: {
          [Op.and]: [{ id: parseInt(id) }, { userId: parseInt(user.id) }],
        },
      }
    );

    if (product.length < 1) {
      return res.send({
        status: 'invalid',
        message: 'Product has been failed to update.',
      });
    }

    res.send({
      status: 'success',
      message: 'Product has been successfuly updated.',
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { params, user } = req;
    const { id } = params;

    const product = await Product.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.send({
        status: 'failed',
        message: "Product isn't exist.",
      });
    }

    if (product.userId !== user.id) {
      return res.status(403).send({
        status: 'forbidden',
        message: "You don't have right to access this.",
      });
    }

    await Product.destroy({
      where: {
        id: parseInt(id),
      },
    });

    return res.send({
      status: 'success',
      message: 'Product has been deleted.',
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};
