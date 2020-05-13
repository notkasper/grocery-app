const { Category, Product } = require('../models');

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).send({ data: categories });
};

exports.getProductsInCategory = async (req, res) => {
  const categoryId = req.params.category_id;
  const { page } = req.params;
  if (!categoryId) {
    res.status(400).send({ error: 'Please provide category id' });
    return;
  }

  const products = await Product.findAll({
    where: { category: categoryId },
    raw: true,
    offset: page * 20,
    limit: 20,
  });
  res.status(200).send({ data: products });
};
