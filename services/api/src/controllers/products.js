const { Product } = require('../models');

const PAGE_SIZE = 20;

exports.getProducts = async (req, res) => {
  try {
    const { stores: storesString, category, page: pageString } = req.query;
    const where = {};
    let offset = 0;
    if (storesString) {
      // comma seperated stores
      const stores = storesString.split(',');
      where.store_name = stores;
    }
    if (category) {
      where.category = category;
    }
    if (pageString) {
      const page = Number.parseInt(pageString, 10);
      offset = page * PAGE_SIZE;
    }
    const productsAndCount = await Product.findAndCountAll({
      where,
      limit: PAGE_SIZE,
      offset,
      raw: true,
    });
    res.status(200).send({ data: productsAndCount });
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

exports.createProducts = async (req, res) => {
  try {
    const { products } = req.body;
    const newProducts = await Product.bulkCreate(products);
    res.status(200).send({ data: newProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    const where = {};
    if (req.query.store) {
      where.store = req.query.store;
    }
    await Product.destroy({ where });
    res.status(200).send({ data: [] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).send({ data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
