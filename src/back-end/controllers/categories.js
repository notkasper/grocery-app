const { Category, Product } = require('../models');

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).send({ data: categories });
};

exports.getProductsInCategory = async (req, res) => {
  const categoryId = req.params.category_id;
  const page = Number.parseInt(req.params.page, 10);
  if (!categoryId) {
    res.status(400).send({ error: 'Please provide category id' });
    return;
  }

  const productsAndCount = await Product.findAndCountAll({
    where: { category: categoryId },
    raw: true,
    offset: page * 20,
    limit: 20,
  });

  res.status(200).send({ data: productsAndCount });
};
