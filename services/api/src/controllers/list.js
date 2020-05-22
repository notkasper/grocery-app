/* eslint-disable object-curly-newline */
const sequelize = require('sequelize');
const { List } = require('../models');

exports.getListItems = async (req, res) => {
  try {
    const list = await List.findOne({
      where: { owner: req.user.id },
      raw: true,
    });
    res.status(200).send({ data: list.items });
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
    list.items.filter((itemId) => {
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
    list.items.filter((itemId) => itemId !== productId);
    await list.save();
    res.status(200).send({ data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
