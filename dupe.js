const { products } = require('./test_data.json');

const keys = {};

products.forEach((product) => {
  if (Object.keys(keys).includes(product.label)) {
    keys[product.label].push(product);
  } else {
    keys[product.label] = [product];
  }
});

Object.keys(keys).forEach((key) => {
  if (keys[key].length > 1) {
    console.log(keys[key]);
  }
});
