/* eslint-disable import/prefer-default-export */
import request from 'superagent';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const getProducts = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/products`)
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
