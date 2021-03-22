const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../../models');

exports.register = async (req, res) => {
  try {
    const { body } = req;
    const { email, password } = body;

    // Validate input.
    const schema = Joi.object({
      email: Joi.string().email().min(6).max(50).required(),
      password: Joi.string().min(6).max(24).required(),
      name: Joi.string().min(1).max(50).required(),
      phone: Joi.string().min(1).max(255),
      gender: Joi.string().min(1).max(255),
      role: Joi.any().valid('user', 'partner'),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Find user with a same email.
    const isEmailExist = await User.findOne({
      where: {
        email,
      },
    });

    // Check if user with a same email is exist and if exist will failed.
    if (isEmailExist) {
      return res.send({
        status: 'failed',
        message: 'Email is already exist.',
      });
    }

    // Encrypt password.
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_STRENGTH)
    );

    // Create new user.
    const user = await User.create({
      ...body,
      password: hashedPassword,
    });
    const { name, role } = user;

    // Create token.
    const token = Jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    return res.send({
      status: 'success',
      message: 'Resgiter is success.',
      data: {
        user: {
          name,
          token,
          role,
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

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const { email, password } = body;

    // Validate input.
    const schema = Joi.object({
      email: Joi.string().email().min(6).max(50).required(),
      password: Joi.string().min(6).max(24).required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Validate user with a same email.
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.send({
        status: 'invalid',
        message: 'Your email and password are incorrect.',
      });
    }

    // Validate password.
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.send({
        status: 'invalid',
        message: 'Your email and password are incorrect.',
      });
    }

    // Create token.
    const { name, role } = user;
    const token = Jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    return res.send({
      status: 'success',
      message: 'Login is successful.',
      data: {
        name,
        token,
        role,
      },
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};
