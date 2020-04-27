import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import ProductCard from './ProductCard';

import gember from '../assets/gember.png';
import worstjes from '../assets/worstjes.jpg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
`;

const Header = styled.p`
  max-width: calc(100vw - 20px);
  display: flex;
  justify-content: space-between;
`;

const HeaderTitle = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
  padding-bottom: 5px;
`;

const HeaderNav = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #44c062;
`;

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
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
      <Container>
        <Header>
          <HeaderTitle>Nieuwe deals</HeaderTitle>
          <HeaderNav>Bekijk alle deals &gt;</HeaderNav>
        </Header>
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
        <Header>
          <HeaderTitle>Populaire deals</HeaderTitle>
          <HeaderNav>Bekijk alle deals &gt;</HeaderNav>
        </Header>
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
      </Container>
    );
  })
);

App.propTypes = {};

export default App;
