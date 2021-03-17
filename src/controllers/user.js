const { User } = require('../../models');

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.send({
    status: 'success',
    data: {
      users,
    },
  });
};
