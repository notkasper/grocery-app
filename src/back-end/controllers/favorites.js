/* eslint-disable object-curly-newline */
const _ = require('lodash');
const uuid = require('uuid');
const { Op } = require('sequelize');
const { Favorite, Product, Category } = require('../models');

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({ where: { user_id: req.user.id } });
  res.status(200).send({ data: favorites });
};

exports.addFavorite = async (req, res) => {
  const categoryId = _.get(req, 'params.category_id');
  const term = _.get(req, 'params.term');

  if (!categoryId) {
    res.status(400).send({ error: 'Please provide category id' });
    return;
  }
  if (!term) {
    res.status(400).send({ error: 'Please provide term' });
    return;
  }

  const favorite = await Favorite.create({
    id: uuid.v4(),
    user_id: req.user.id,
    category_id: categoryId,
    term,
  });
  res.status(200).send({ data: favorite });
};

exports.getFavoriteOptions = async (req, res) => {
  try {
    const term = _.get(req, 'params.term');
    if (!term) {
      res.status(400).send({ error: 'Please provide term' });
      return;
    }

    if (term.length < 3) {
      res
        .status(400)
        .send({ error: 'Please provide a term with a length of at least 3' });
      return;
    }

    const products = await Product.findAll({
      where: {
        label: {
          [Op.iLike]: `%${term}%`,
        },
      },
      limit: 1000,
    });

    const categories = await Category.findAll();

    res.status(200).send({ data: { products, categories } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: 'Something went wrong, please try again later' });
  }
};
