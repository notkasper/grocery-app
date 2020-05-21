/* eslint-disable object-curly-newline */
import firebase from 'firebase/app';
import 'firebase/auth';
import { observable, action } from 'mobx';
import {
  getProducts as getProductsService,
  getProduct as getProductService,
  getFavoriteOptions as getFavoriteOptionsService,
  addFavorite as addFavoriteService,
  getFavorites as getFavoritesService,
  deleteFavorite as deleteFavoriteService,
} from '../connectors/products';

class ApplicationStore {
  @observable products = {};

  @observable productsPerCategory = {};

  @observable favorites = {};

  @observable authenticated = false;

  @observable navbarLabel = 'Dingen.';

  @action getProducts = async (page) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      console.log(idToken);
      const {
        body: {
          // eslint-disable-next-line no-unused-vars
          data: { rows: newProducts, count },
        },
      } = await getProductsService(idToken, null, null, page);
      this.products = {};
      newProducts.forEach((newProduct) => {
        this.products[newProduct.id] = newProduct;
      });
      return { newProducts, count };
    } catch (error) {
      console.error(`Error while getting products: ${error}`);
    }
  };

  @action getProductsInCategory = async (categoryId, page) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const {
        body: {
          data: { rows: newProducts, count },
        },
      } = await getProductsService(idToken, null, categoryId, page);
      this.productsPerCategory[categoryId] = {
        count,
        products: {},
      };
      newProducts.forEach((newProduct) => {
        this.productsPerCategory[categoryId].products[
          newProduct.id
        ] = newProduct;
      });
    } catch (error) {
      console.error(`Error while getting products in category: ${error}`);
    }
  };

  @action getProduct = async (id) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const {
        body: { data: product },
      } = await getProductService(idToken, id);
      return product;
    } catch (error) {
      console.error(`Error while getting products: ${error}`);
    }
    return null;
  };

  @action getFavorites = async () => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const {
        body: { data: newFavorites },
      } = await getFavoritesService(idToken);
      this.favorites = {};
      newFavorites.forEach((newFavorite) => {
        this.favorites[newFavorite.favorite.id] = newFavorite;
      });
    } catch (error) {
      console.error(`Error while getting favorites: ${error}`);
    }
  };

  @action getFavoriteOptions = async (term) => {
    let response;
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      response = await getFavoriteOptionsService(idToken, term);
    } catch (error) {
      console.error(`Error while getting favorites: ${error}`);
    }
    return response;
  };

  @action addFavorite = async (categoryId, term) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await addFavoriteService(idToken, categoryId, term);
    } catch (error) {
      console.error(`Error while adding favorite: ${error}`);
    }
  };

  @action deleteFavorite = async (id) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await deleteFavoriteService(idToken, id);
    } catch (error) {
      console.error(`Error while deleting favorite: ${error}`);
    }
  };
}

export default new ApplicationStore();
