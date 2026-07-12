const User = require('../models/User');

const findByEmail = (email, includePassword = false) => {
  const query = User.findOne({ email });

  if (includePassword) {
    query.select('+password');
  }

  return query;
};

const findById = (id) => User.findById(id);

const create = (userData) => User.create(userData);

const emailExists = async (email) => {
  const user = await User.findOne({ email }).select('_id');
  return Boolean(user);
};

module.exports = {
  findByEmail,
  findById,
  create,
  emailExists,
};
