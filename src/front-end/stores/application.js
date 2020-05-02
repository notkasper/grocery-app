/* eslint-disable object-curly-newline */
import { observable, action } from 'mobx';
import { getProducts as getProductsService } from '../services/products';

class ApplicationStore {
  @observable products = {};

  @action getProducts = async () => {
    try {
      const {
        body: { data: newProducts },
      } = await getProductsService();
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
