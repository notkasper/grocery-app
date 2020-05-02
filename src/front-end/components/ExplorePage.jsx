import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import gember from '../assets/gember.png';
import worstjes from '../assets/worstjes.jpg';

import AppleSvg from '../assets/apple.svg';
import BreadSvg from '../assets/bread.svg';
import CookieSvg from '../assets/cookie.svg';
import CarrotSvg from '../assets/carrot.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  margin-bottom: 50px;
`;

const CategoriesContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
`;

const CategoryContainer = styled.div`
  width: 100px;
  height: 100px;
  padding-right: 10px;
`;

const CategoryBubble = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 100%;
  width: 100%;
  height: 100%;
`;

const CategoryLabel = styled.div`
  padding-top: 5px;
  font-family: Work Sans;
  font-style: normal;
  font-weight: 200;
  font-size: 18px;
  line-height: 21px;
  text-align: center;

  color: #000000;
`;

const Apple = styled(AppleSvg)`
  fill: #44c062;
  width: 50%;
  height: 50%;
  padding: 25%;
`;

const Carrot = styled(CarrotSvg)`
  fill: #44c062;
  width: 50%;
  height: 50%;
  padding: 25%;
`;

const Bread = styled(BreadSvg)`
  fill: #44c062;
  width: 50%;
  height: 50%;
  padding: 25%;
`;

const Cookie = styled(CookieSvg)`
  fill: #44c062;
  width: 50%;
  height: 50%;
  padding: 25%;
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
        <CategoriesContainer>
          <CategoryContainer>
            <CategoryBubble>
              <Apple />
            </CategoryBubble>
            <CategoryLabel>Fruit</CategoryLabel>
          </CategoryContainer>
          <CategoryContainer>
            <CategoryBubble>
              <Carrot />
            </CategoryBubble>
            <CategoryLabel>Fruit</CategoryLabel>
          </CategoryContainer>
          <CategoryContainer>
            <CategoryBubble>
              <Bread />
            </CategoryBubble>
            <CategoryLabel>Fruit</CategoryLabel>
          </CategoryContainer>
          <CategoryContainer>
            <CategoryBubble>
              <Cookie />
            </CategoryBubble>
            <CategoryLabel>Fruit</CategoryLabel>
          </CategoryContainer>
        </CategoriesContainer>
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
