import firebase from 'firebase/app';
import 'firebase/auth';

export const getIdToken = async () => {
  const idToken = await firebase.auth().currentUser.getIdToken();
  return idToken;
};

export const filterDuplicates = (products) => {
  const keys = {};

  products.forEach((product) => {
    if (Object.keys(keys).includes(product.label)) {
      keys[product.label].push(product);
    } else {
      keys[product.label] = [product];
    }
  });

  let dupeCounter = 0;
  const uniques = [];

  Object.keys(keys).forEach((key) => {
    if (keys[key].length > 1) {
      dupeCounter++;
    }
    uniques.push(keys[key][0]);
  });

  return [uniques, dupeCounter];
};
