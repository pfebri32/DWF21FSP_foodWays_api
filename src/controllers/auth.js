const e = require('express');
const { User } = require('../../models');

exports.login = async (req, res) => {
  try {
    const { body, params } = req;
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
        // What password is correct.
        return res.send({
          status: 'success',
          message: 'Login is successful.',
          data: {
            user: {
              name: user.fullname,
              email: user.email,
              token: 'token',
            },
          },
        });
      } else {
        // What password is incorrect.
        return res.send({
          status: 'failed',
          message: 'Your password is incorrect.',
        });
      }
    } else {
      return res.send({
        status: 'failed',
        message: "Your email doesn't exist.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
