/* eslint-disable import/prefer-default-export */
import request from 'superagent';

const API_BASE_URL = 'http://139.162.207.169/api/v1';

export const getProducts = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/products`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const getProduct = async (idToken, id) => {
  const response = await request
    .get(`${API_BASE_URL}/products/${id}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const getFavorites = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/favorites`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const getFavoriteOptions = async (idToken, term) => {
  const response = await request
    .get(`${API_BASE_URL}/favorites/options/${term}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const addFavorite = async (idToken, categoryId, term) => {
  const response = await request
    .post(`${API_BASE_URL}/favorites/${categoryId}/${term}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const deleteFavorite = async (idToken, id) => {
  const response = await request
    .delete(`${API_BASE_URL}/favorites/${id}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const getProductsInCategory = async (
  idToken,
  categoryId,
  offset = 0
) => {
  const response = await request
    .get(`${API_BASE_URL}/categories/${categoryId}/${offset}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};
