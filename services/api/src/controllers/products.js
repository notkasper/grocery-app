const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.params.page, 10);
    const products = await Product.findAll({
      limit: 20,
      order: [['updatedAt', 'DESC']],
      offset: page * 20,
      raw: true,
    });
    res.status(200).send({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id }, raw: true });
    res.status(200).send({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { product } = req.body;
    const newProduct = await Product.create(product);
    res.status(200).send({ data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
