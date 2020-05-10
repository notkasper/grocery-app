/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import ProductCard from './ProductCard';

import Bread from '../assets/bread.svg';
import Cookie from '../assets/cookie.svg';
import Carrot from '../assets/carrot.svg';
import Salad from '../assets/salad.svg';
import Cereal from '../assets/cereals.svg';
import Meat from '../assets/meat.svg';
import Eggs from '../assets/eggs.svg';
import Cheese from '../assets/cheese.svg';
import Baby from '../assets/baby.svg';
import Soda from '../assets/soda.svg';
import Alcohol from '../assets/alcohol.svg';
import Earth from '../assets/earth.svg';
import Paw from '../assets/paw.svg';
import Cooking from '../assets/cooking.svg';
import Freezer from '../assets/freezer.svg';
import Pasta from '../assets/pasta.svg';
import Soup from '../assets/soup.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  margin-bottom: 50px;
  min-height: calc(100vh - 100px);
`;

const CategoriesContainer = styled.div`
  padding-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;

  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 75px;
  padding: 5px;
`;

const CategoryBubble = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 100%;

  svg {
    fill: #44c062;
    width: 50%;
    height: 50%;
    padding: 25%;
  }
`;

const CategoryLabel = styled.div`
  padding-top: 5px;
  font-weight: 200;
  font-size: 11px;
  line-height: 21px;
  text-align: center;
  white-space: initial;

  color: #000000;
`;

const Header = styled.div`
  max-width: calc(100vw - 20px);
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
`;

const HeaderTitle = styled.p`
  font-family: Work Sans;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
  padding-bottom: 5px;
`;

const HeaderNav = styled.p`
  font-family: Work Sans;
  font-size: 13px;
  line-height: 15px;
  color: #44c062;
`;

const ProductShowcase = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const categories = [
  {
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
    label: 'Aardappel, groente, fruit',
    icon: <Carrot />,
  },
  {
    id: '11f3a62f-4df7-4fd7-b985-03366a9d3ecd',
    label: 'Salades, pizza, maaltijden',
    icon: <Salad />,
  },
  {
    id: '85698cd6-d8eb-4883-8dd2-ba1c1733ec13',
    label: 'Vlees, kip, vis, vega',
    icon: <Meat />,
  },
  {
    id: '4d19851c-c0c9-48d6-85b2-ae007237f3a9',
    label: 'Kaas, vleeswaren, tapas',
    icon: <Cheese />,
  },
  {
    id: '444e3a99-8c88-4b09-b70a-0d5108e09906',
    label: 'Boter, eieren, zuivel',
    icon: <Eggs />,
  },
  {
    id: '3cee0cd0-0a1c-46ce-90fe-e93b824df04d',
    label: 'Brood en gebak',
    icon: <Bread />,
  },
  {
    id: '143ca1c5-2d7e-491a-8e59-0a5c25e4f9e3',
    label: 'Ontbijtgranen, beleg, tussendoor',
    icon: <Cereal />,
  },
  {
    id: '6dc98c4d-8e40-46b3-bc15-4121dad2a954',
    label: 'Frisdrank, koffie, thee, sappen',
    icon: <Soda />,
  },
  {
    id: '2e67fcdc-37b0-4782-96c2-f1ed9edf2623',
    label: 'Wijn, bier, sterke drank',
    icon: <Alcohol />,
  },
  {
    id: '7c5ad839-a50d-4d6b-b100-852d1a9d6308',
    label: 'Pasta, rijst, wereldkeuken',
    icon: <Pasta />,
  },
  {
    id: '9eb0ce98-ad14-43ff-b04d-e086c48252de',
    label: 'Soepen, sauzen, kruiden, olie',
    icon: <Soup />,
  },
  {
    id: 'f0017007-b349-4b59-8cf9-3bf456e01c80',
    label: 'Chips, koek, snoep, chocolade',
    icon: <Cookie />,
  },
  {
    id: '2d07a92d-de8a-4948-809b-9d38b4cd9431',
    label: 'Diepvries',
    icon: <Freezer />,
  },
  {
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',
    label: 'Baby, drogisterij',
    icon: <Baby />,
  },
  {
    id: 'd9f1b75f-5ace-4aa9-b79a-2a30a1a76f01',
    label: 'Bewuste voeding',
    icon: <Earth />,
  },
  {
    id: '47cb0d4a-97e9-49c9-acd7-558b24b2ca43',
    label: 'Huishouden, huisdier',
    icon: <Paw />,
  },
  {
    id: 'd2be8627-1593-4547-81d9-9aed82e2b30c',
    label: 'Koken, tafelen, vrije tijd',
    icon: <Cooking />,
  },
];

const App = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [loading, setLoading] = useState(false);
    const history = useHistory();
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
          {categories.map((category) => (
            <CategoryContainer
              key={category.id}
              onClick={() => {
                history.push(`/categories/${category.id}`);
                applicationStore.navbarLabel = category.label;
              }}
            >
              <CategoryBubble>{category.icon}</CategoryBubble>
              <CategoryLabel>{category.label} </CategoryLabel>
            </CategoryContainer>
          ))}
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
