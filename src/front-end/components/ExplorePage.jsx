import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import ProductCard from './ProductCard';

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

const Header = styled.div`
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
  display: flex;
  justify-content: flex-start;
`;

const App = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [loading, setLoading] = useState(false);
    const loadProducts = async () => {
      setLoading(true);
      await applicationStore.getProducts();
      setLoading(false);
    };
    useEffect(() => {
      loadProducts();
    }, []);
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductShowcase>
            {Object.values(applicationStore.products).map((product) => (
              <ProductCard
                id={product.id}
                image={product.image}
                storeName={product.store_name}
                title={product.label}
                amountText={product.amount}
                cost={product.new_price}
                likes={product.likes}
                key={product.id}
              />
            ))}
          </ProductShowcase>
        )}
        <Header>
          <HeaderTitle>Populaire deals</HeaderTitle>
          <HeaderNav>Bekijk alle deals &gt;</HeaderNav>
        </Header>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductShowcase>
            {Object.values(applicationStore.products).map((product) => (
              <ProductCard
                id={product.id}
                image={product.image}
                storeName={product.store_name}
                title={product.label}
                amountText={product.amount}
                cost={product.new_price}
                likes={product.likes}
                key={product.id}
              />
            ))}
          </ProductShowcase>
        )}
      </Container>
    );
  })
);

App.propTypes = {};

export default App;
