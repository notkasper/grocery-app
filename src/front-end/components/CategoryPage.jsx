/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import Loader from './Loader';

const Container = styled.div`
  background-color: #f1f6fa;
  grid-gap: 10px;
  min-height: calc(100vh - 100px);
  padding-bottom: 50px;

  .product-list {
    display: grid;
    margin: auto;
    grid-template-columns: repeat(auto-fit, 132px);
    grid-gap: 5px;
  }
`;

const LoaderContainer = styled.div`
  height: 50px;
  margin-top: calc(50vh - 50px);
`;

const CategoryPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [loading, setLoading] = useState(false);
    const loadProductsInCategory = async () => {
      setLoading(true);
      await applicationStore.getProductsInCategory(props.match.params.id);
      setLoading(false);
    };
    useEffect(() => {
      loadProductsInCategory();
    }, []);
    if (loading) {
      return (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      );
    }
    const productsInCategory =
      applicationStore.productsPerCategory[props.match.params.id] || {};
    return (
      <Container>
        <p className="header">Categorie</p>
        <div className="product-list">
          {Object.values(productsInCategory).map((product) => (
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
        </div>
      </Container>
    );
  })
);

CategoryPage.propTypes = {};

export default CategoryPage;
