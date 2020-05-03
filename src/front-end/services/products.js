/* eslint-disable import/prefer-default-export */
import request from 'superagent';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const getProducts = async (idToken) => {
  const response = await request
    .get(`${API_BASE_URL}/products`)
    .set('id_token', idToken);
  return response;
};
