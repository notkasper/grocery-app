import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

import gember from '../assets/gember.png';
import worstjes from '../assets/worstjes.jpg';

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
  background-color: #f1f6fa;
  padding: 15px;
`;

const products = [
  {
    image: gember,
    storeName: 'jumbo',
    title: 'Super gember mega cool',
    amountText: '1kg',
    cost: '0.99',
    likes: 32,
  },
  {
    image: worstjes,
    storeName: 'albertHeijn',
    title: 'worstjes',
    amountText: '500g',
    cost: '1.50',
    likes: 12340,
  },
  {
    image: worstjes,
    storeName: 'albertHeijn',
    title: 'worstjes',
    amountText: '500g',
    cost: '1.50',
    likes: 4324,
  },
];

@inject('applicationStore')
@observer
class App extends Component {
  render() {
    const { applicationStore } = this.props;
    return (
      <>
        <ProductShowcase>
          {products.map((product) => (
            <ProductCard
              image={product.image}
              storeName={product.storeName}
              title={product.title}
              amountText={product.amountText}
              cost={product.cost}
              likes={product.likes}
            />
          ))}
        </ProductShowcase>
      </>
    );
  }
}

App.propTypes = {
  applicationStore: MobxPropTypes.observableObject.isRequired,
};

export default hot(App);
