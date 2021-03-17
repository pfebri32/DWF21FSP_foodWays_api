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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: 'success',
      message: `User with ID = ${id} has been deleted.`,
      data: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
