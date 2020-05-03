/* eslint-disable object-curly-newline */
import firebase from 'firebase';
import { observable, action } from 'mobx';
import { getProducts as getProductsService } from '../services/products';

class ApplicationStore {
  @observable products = {};

  @observable authenticated = false;

  @action getProducts = async () => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const {
        body: { data: newProducts },
      } = await getProductsService(idToken);
      this.products = {};
      newProducts.forEach((newProduct) => {
        this.products[newProduct.id] = newProduct;
      });
    } catch (error) {
      console.error(`Error while updating products: ${error}`);
    }
  };
}

export default new ApplicationStore();
