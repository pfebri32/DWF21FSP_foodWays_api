const Joi = require('joi');

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
    console.log(err);
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Required auth as middleware.
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(0).max(255).required(),
      price: Joi.number().min(0).required(),
      img: Joi.string().max(255),
    });

    const { error } = schema.validate(body);
    if (error) {
      return res.send({
        status: 'Invalid',
        message: error.details.message[0],
      });
    }

    const product = await Product.create({
      ...body,
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
};

exports.getProductsByPartner = async (req, res) => {
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
    console.log(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Required Auth middleware.
    const { user, body, params } = req;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      image: Joi.string().min(1).max(255),
      price: Joi.number().min(0).required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'Invalid',
        message: error.details.message[0],
      });
    }

    // Update product.
    const product = await Product.update(body, {
      where: {
        [Op.and]: [{ id: parseInt(id) }, { userId: parseInt(user.id) }],
      },
    });

    if (product.length < 1) {
      return res.send({
        status: 'Failed',
        message: 'Product has been failed to update.',
      });
    }

    res.send({
      status: 'Success',
      message: 'Product has been successfuly updated.',
    });
  } catch (err) {
    console.log(err);
  }
};
