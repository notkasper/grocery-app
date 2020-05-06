/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable object-curly-newline */
const _ = require('lodash');
const uuid = require('uuid');
const { Op } = require('sequelize');
const { Favorite, Product, Category } = require('../models');

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { user_id: req.user.id },
    raw: true,
  });
  const categories = await Category.findAll({ raw: true });
  const richFavorites = [];
  for (const favorite of favorites) {
    const products = await Product.findAll({
      where: {
        label: {
          [Op.iLike]: `%${favorite.term}%`,
        },
      },
      limit: 1000,
      raw: true,
    });
    richFavorites.push({
      category: categories.find((cat) => cat.id === favorite.category_id),
      products,
      favorite,
    });
  }
  res.status(200).send({ data: richFavorites });
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

exports.deleteFavorite = async (req, res) => {
  const id = _.get(req, 'params.id');

  if (!id) {
    res.status(400).send({ error: 'Please provide favorite id' });
    return;
  }

  await Favorite.delete({
    where: { id, user_id: req.user.id },
  });
  res.status(200).send({ data: {} });
};

exports.getFavoriteOptions = async (req, res) => {
  try {
    const term = _.get(req, 'params.term');
    if (!term) {
      res.status(400).send({ error: 'Please provide term' });
      return;
    }

    if (term.length < 2) {
      res
        .status(400)
        .send({ error: 'Please provide a term with a length of at least 2' });
      return;
    }

    const products = await Product.findAll({
      where: {
        label: {
          [Op.iLike]: `%${term}%`,
        },
      },
      limit: 1000,
      raw: true,
    });

    const categories = await Category.findAll({ raw: true });

    res.status(200).send({ data: { products, categories } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: 'Something went wrong, please try again later' });
  }
};
