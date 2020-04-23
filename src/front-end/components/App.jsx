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

@inject('applicationStore')
@observer
class App extends Component {
  render() {
    const { applicationStore } = this.props;
    return (
      <>
        <ProductShowcase>
          <ProductCard image={gember} storeName="jumbo" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
        </ProductShowcase>
        <ProductShowcase>
          <ProductCard image={gember} storeName="jumbo" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
        </ProductShowcase>
        <ProductShowcase>
          <ProductCard image={gember} storeName="jumbo" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
          <ProductCard image={worstjes} storeName="albertHeijn" />
        </ProductShowcase>
      </>
    );
  }
}

App.propTypes = {
  applicationStore: MobxPropTypes.observableObject.isRequired,
};

export default hot(App);
