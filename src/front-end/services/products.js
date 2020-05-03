/* eslint-disable import/prefer-default-export */
import request from 'superagent';

const API_BASE_URL = 'http://139.162.207.169/api/v1';

export const getProducts = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/products`)
    .set('id_token', idToken);
  return response;
};

export const getFavorites = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/favorites`)
    .set('id_token', idToken);
  return response;
};

export const getFavoriteOptions = async (idToken, term) => {
  const response = await request
    .get(`${API_BASE_URL}/favorites/options/${term}`)
    .set('id_token', idToken);
  return response;
};

export const addFavorite = async (idToken, categoryId, term) => {
  const response = await request
    .post(`${API_BASE_URL}/favorites/${categoryId}/${term}`)
    .set('id_token', idToken);
  return response;
};
