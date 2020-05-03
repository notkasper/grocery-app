const _ = require('lodash');
const uuid = require('uuid');
const { Favorite } = require('../models');

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({ where: { user_id: req.user.id } });
  res.status(200).send({ data: favorites });
};

exports.addFavorite = async (req, res) => {
  const categoryId = _.get(req, 'body.category_id');
  const term = _.get(req, 'body.term');

  if (!categoryId) {
    res.status(400).send({ error: 'Please provide category id' });
    return;
  }
  if (!term) {
    res.status(400).send({ error: 'Please provide term' });
    return;
  }

  const favourite = await Favorite.create({
    id: uuid.v4(),
    user_id: req.user.id,
    category_id: categoryId,
    term,
  });
  res.status(200).send({ data: favourite });
};
