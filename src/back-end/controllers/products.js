const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  const page = Number.parseInt(req.params.page, 10);
  const products = await Product.findAll({
    limit: 20,
    order: [['updatedAt', 'DESC']],
    offset: page * 20,
    raw: true,
  });
  res.status(200).send({ data: products });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ where: { id }, raw: true });
  res.status(200).send({ data: product });
};
