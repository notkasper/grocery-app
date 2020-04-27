import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
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
    id: 1,
    image: gember,
    storeName: 'jumbo',
    title: 'Super gember mega cool',
    amountText: '1kg',
    cost: '0.99',
    likes: 32,
  },
  {
    id: 2,
    image: worstjes,
    storeName: 'albertHeijn',
    title: 'worstjes',
    amountText: '500g',
    cost: '1.50',
    likes: 12340,
  },
  {
    id: 3,
    image: worstjes,
    storeName: 'albertHeijn',
    title: 'worstjes',
    amountText: '500g',
    cost: '1.50',
    likes: 12340,
  },
];

const App = inject('applicationStore')(
  observer((props) => {
    console.info(props.applicationStore.foo);
    return (
      <ProductShowcase>
        {products.map((product) => (
          <ProductCard
            image={product.image}
            storeName={product.storeName}
            title={product.title}
            amountText={product.amountText}
            cost={product.cost}
            likes={product.likes}
            key={product.id}
          />
        ))}
      </ProductShowcase>
    );
  })
);

App.propTypes = {};

export default App;
