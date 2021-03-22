const Jwt = require('jsonwebtoken');

const { User } = require('../../models');

exports.authenticated = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header('Authorization')) ||
    !(token = header.replace('Bearer ', ''))
  ) {
    return res.status(401).send({
      status: 'failed',
      status: 'Access Denied',
    });
  }

  try {
    const verified = Jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send({
      status: 'failed',
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
        return res.status(403).send({
          status: 'Forbidden.',
          message: "You don't have right to access this.",
        });
      }

      req.role = filtered[0];
      next();
    } catch (err) {
      return res.status(401).send({
        status: 'Access Denied.',
        message: err,
      });
    }
  };
};
