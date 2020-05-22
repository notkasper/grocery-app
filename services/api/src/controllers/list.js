/* eslint-disable object-curly-newline */
const sequelize = require('sequelize');
const { List, Product } = require('../models');

exports.getListItems = async (req, res) => {
  try {
    const list = await List.findOne({
      where: { owner: req.user.id },
      raw: true,
    });
    const listItemsWithCount = {};
    list.items.forEach((itemId) => {
      if (!listItemsWithCount[itemId]) {
        listItemsWithCount[itemId] = {
          count: 1,
          id: itemId,
        };
        return;
      }
      listItemsWithCount[itemId].count += 1;
    });
    const products = await Product.findAll({
      where: { id: Object.keys(listItemsWithCount) },
      raw: true,
    });
    const productsByKey = {};
    products.forEach((product) => {
      productsByKey[product.id] = product;
    });
    Object.keys(listItemsWithCount).forEach((key) => {
      listItemsWithCount[key].product = productsByKey[key];
    });
    res.status(200).send({ data: Object.values(listItemsWithCount) });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.addListItem = async (req, res) => {
  try {
    const { id: productId } = req.params;
    await List.update(
      {
        items: sequelize.fn('array_append', sequelize.col('items'), productId),
      },
      { where: { owner: req.user.id } }
    );
    res.status(200).send({ data: productId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteListItemSingle = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const list = await List.findOne({ where: { owner: req.user.id } });
    let found = false;
    list.items = list.items.filter((itemId) => {
      if (itemId === productId && !found) {
        found = true;
        return false;
      }
      return true;
    });
    await list.save();
    res.status(200).send({ data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

exports.deleteListItemAll = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const list = await List.findOne({ where: { owner: req.user.id } });
    list.items = list.items.filter((itemId) => itemId !== productId);
    await list.save();
    res.status(200).send({ data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
