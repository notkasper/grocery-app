const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  const products = await Product.findAll({
    limit: 20,
    order: [['updatedAt', 'DESC']],
  });
  res.status(200).send({ data: products });
};
