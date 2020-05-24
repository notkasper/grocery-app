/* eslint-disable object-curly-newline */
const { List, Product } = require('../models');

exports.getListItems = async (req, res) => {
  try {
    const list = await List.findOne({
      where: { owner: req.user.id },
      raw: true,
    });
    const productIds = list.items.map((item) => item.id);
    const productsById = {};
    (await Product.findAll({ where: { id: productIds } })).forEach(
      (product) => {
        productsById[product.id] = product;
      }
    );
    const listWithProducts = list.items.map((item) => ({
      id: item.id,
      count: item.count,
      product: productsById[item.id],
    }));
    res.status(200).send({ data: listWithProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.addListItem = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { amount: unparsedAmount } = req.query;
    const amount = unparsedAmount ? Number.parseInt(unparsedAmount, 10) : 1;
    const list = await List.findOne({ where: { owner: req.user.id } });
    const newItems = [...list.items];
    const existingItem = newItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.count += amount;
    } else {
      newItems.push({
        id: productId,
        count: amount,
      });
    }
    list.items = newItems;
    await list.save();
    res.status(200).send({ data: productId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteListItem = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { amount: unparsedAmount } = req.query;
    const amount = unparsedAmount ? Number.parseInt(unparsedAmount, 10) : 1;
    const list = await List.findOne({ where: { owner: req.user.id } });
    list.items.forEach((item, index) => {
      if (item.id === productId) {
        list.items[index].count -= amount;
        if (item.count <= 0) {
          delete list.items[index];
        }
      }
    });
    await list.save();
    res.status(200).send({ data: productId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
