const Joi = require('joi');

const { User } = require('../../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
    res.send({
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { body } = req;
    const { id } = body;

    await User.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      message: 'User has been deleted.',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { body, user } = req;

    // Validate input.
    const schema = Joi.object({
      name: Joi.string().min(4).max(50),
      phone: Joi.string().min(8).max(13),
      gender: Joi.string().min(3).max(50),
      img: Joi.string().min(1).max(255),
      loc_address: Joi.string().min(1).max(255),
      loc_lat: Joi.number(),
      loc_lng: Joi.number(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'Invalid',
        message: error.details.message[0],
      });
    }

    const updatedUser = await User.update(body, {
      where: {
        id: user.id,
      },
    });

    res.send({
      status: 'success',
      message: 'Your profile has been updated.',
      data: {
        user: updatedUser[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
};
