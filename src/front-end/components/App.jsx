import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background-color: #f1f6fa;
  padding: 20px;
`;

@inject('applicationStore')
@observer
class App extends Component {
  render() {
    const { applicationStore } = this.props;
    return (
      <ProductShowcase>
        <ProductCard />
      </ProductShowcase>
    );
  }
}

App.propTypes = {
  applicationStore: MobxPropTypes.observableObject.isRequired,
};

export default hot(App);
