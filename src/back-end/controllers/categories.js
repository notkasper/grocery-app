const { Category } = require('../models');

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).send({ data: categories });
};
