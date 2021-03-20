const Jwt = require('jsonwebtoken');

const { User } = require('../../models');

exports.authenticated = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header('Authorization')) ||
    !(token = header.replace('Bearer ', ''))
  ) {
    return res.send({
      status: 'Failed',
      status: 'Access Denied',
    });
  }

  try {
    const verified = Jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      status: 'Failed',
      message: 'Invalid Token',
    });
  }
};

// WARNING. Higher role need to be first for a priority.
exports.hasRoles = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.user.id,
        },
      });

      const filtered = roles.filter((role) => role === user.role);
      if (filtered.length < 1) {
        return res.send({
          status: 'Access Denied',
          message: "You don't have authority to access.",
        });
      }

      req.role = filtered[0];
      next();
    } catch (err) {
      console.log(err);
    }
  };
};
