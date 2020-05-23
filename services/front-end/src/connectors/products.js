/* eslint-disable import/prefer-default-export */
import request from 'superagent';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://176.58.120.90/api/v1'
    : 'http://localhost:5000/api/v1';

export const getProducts = async (idToken, store, category, page) => {
  const response = await request
    .get(`${API_BASE_URL}/products`)
    .set('authorization', `Bearer ${idToken}`)
    .query({ page, store, category });
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

export const getListItems = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/list`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const deleteListItemAll = async (idToken, id) => {
  const response = await request
    .delete(`${API_BASE_URL}/list/${id}/all`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const deleteListItem = async (idToken, id) => {
  const response = await request
    .delete(`${API_BASE_URL}/list/${id}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};

export const addListItem = async (idToken, id) => {
  const response = await request
    .post(`${API_BASE_URL}/list/${id}`)
    .set('authorization', `Bearer ${idToken}`);
  return response;
};
