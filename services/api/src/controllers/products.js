const { Product } = require('../models');

const PAGE_SIZE = 20;

exports.getProducts = async (req, res) => {
  try {
    const {
      stores: storesString,
      category,
      limit: limitString,
      offset: offsetString,
    } = req.query;
    const where = {};
    if (storesString) {
      // comma seperated stores
      const stores = storesString.split(',');
      where.store_name = stores;
    }
    if (category) {
      where.category = category;
    }
    const limit = Number.parseInt(limitString, 10);
    const offset = Number.parseInt(offsetString, 10);
    const productsAndCount = await Product.findAndCountAll({
      where,
      limit: limit || PAGE_SIZE,
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.status(204).send({ message: 'DELETED' });
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
    const { ids: idsString } = req.query;
    const ids = idsString.split(',');
    await Product.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'DELETED' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteAllProducts = async (req, res) => {
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

exports.compareStoreProducts = async (req, res) => {
  try {
    const { products: compareProducts, store } = req.body;

    // must contain at least one product and a store name
    if (!compareProducts.length || !store) {
      res
        .status(400)
        .send({ error: 'No products or store found in request body' });
      return;
    }

    // Check if all new products belong to the same store
    let sameStore = true;
    compareProducts.forEach((product) => {
      if (product.store_name !== store) {
        sameStore = false;
      }
    });
    if (!sameStore) {
      res
        .status(400)
        .send({ error: 'All products must belong to the same store' });
      return;
    }
    const products = await Product.findAll({ where: { store_name: store } });

    // Make a dictionary with product labels (those are unique) as indices
    const productsLabelMap = {};
    products.forEach((product) => {
      productsLabelMap[product.label] = product;
    });

    const compareProductsLabelMap = {};
    compareProducts.forEach((product) => {
      compareProductsLabelMap[product.label] = product;
    });

    // compare dictionaries
    const duplicateProducts = [];
    const newProducts = [];
    const removedProducts = [];

    Object.keys(compareProductsLabelMap).forEach((compLabel) => {
      if (!productsLabelMap[compLabel]) {
        newProducts.push(compareProductsLabelMap[compLabel]);
      } else {
        duplicateProducts.push(compareProductsLabelMap[compLabel]);
      }
    });

    Object.keys(productsLabelMap).forEach((compLabel) => {
      if (!compareProductsLabelMap[compLabel]) {
        removedProducts.push(productsLabelMap[compLabel]);
      }
    });

    res.status(200).send({
      data: {
        duplicate_products_count: duplicateProducts.length,
        new_products_count: newProducts.length,
        removed_products_count: removedProducts.length,
        duplicate_products: duplicateProducts,
        new_products: newProducts,
        removed_products: removedProducts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
