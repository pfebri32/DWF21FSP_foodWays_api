const e = require('express');
const { User } = require('../../models');

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const { email, password } = body;

    // Find user with a same email.
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Check if user is exist.
    if (user) {
      // Check if an email with a same password.
      if (user.password === password) {
        // When password is correct.
        return res.send({
          status: 'success',
          message: 'Login is success.',
          data: {
            user: {
              name: user.fullname,
              email: user.email,
              token: 'token',
            },
          },
        });
      } else {
        // When password is incorrect.
        return res.send({
          status: 'failed',
          message: 'Your password is incorrect.',
        });
      }
    } else {
      // When user with email doesn't exist.
      return res.send({
        status: 'failed',
        message: "Your email doesn't exist.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.register = async (req, res) => {
  try {
    const { body } = req;
    const { email } = body;

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
        message: 'User with this email is already exist.',
      });
    }

    // Create new user.
    const user = await User.create(body);
    const { fullname, role } = user;

    res.send({
      status: 'success',
      message: 'Resgiter is success.',
      data: {
        user: {
          fullname,
          token: 'token',
          role,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
