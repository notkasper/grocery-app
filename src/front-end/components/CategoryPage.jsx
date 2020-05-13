/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import BackSvg from '../assets/back.svg';
import Loader from './Loader';

const Container = styled.div`
  background-color: #f1f6fa;
  grid-gap: 10px;
  min-height: calc(100vh - 100px);
  padding-bottom: 50px;
  margin: 20px 0;

  .product-list {
    display: grid;
    margin: auto;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, 136px);
    grid-gap: 5px;
  }
`;

const LoaderContainer = styled.div`
  height: 50px;
  margin-top: calc(50vh - 50px);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20vw;

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    margin-top: 13px;
    fill: #44c062;
  }

  .next {
    transform: rotate(180deg);
  }

  p {
    width: 24px;
    font-family: Work Sans;
    font-size: 24px;
    line-height: 24px;
    text-align: center;
    color: #000000;
    margin-top: 13px;
  }

  .current {
    border: 2px solid #44c062;
    border-radius: 8px;
  }
`;

const CategoryPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const loadProductsInCategory = async () => {
      setLoading(true);
      await applicationStore.getProductsInCategory(props.match.params.id, page);
      setLoading(false);
    };
    useEffect(() => {
      applicationStore.navbarLabel = props.match.params.label;
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
        <PaginationContainer>
          {page > 0 ? (
            <BackSvg
              className="previous"
              onClick={() => {
                setPage(page - 1);
                loadProductsInCategory();
              }}
            />
          ) : (
            <p />
          )}
          {page > 1 ? (
            <p
              onClick={() => {
                setPage(page - 2);
                loadProductsInCategory();
              }}
            >
              {page - 1}
            </p>
          ) : null}
          {page > 0 ? (
            <p
              onClick={() => {
                setPage(page - 1);
                loadProductsInCategory();
              }}
            >
              {page}
            </p>
          ) : null}
          <p className="current">{page + 1}</p>
          <p
            onClick={() => {
              setPage(page + 1);
              loadProductsInCategory();
            }}
          >
            {page + 2}
          </p>
          <p
            onClick={() => {
              setPage(page + 2);
              loadProductsInCategory();
            }}
          >
            {page + 3}
          </p>
          <BackSvg
            className="next"
            onClick={() => {
              setPage(page + 1);
              loadProductsInCategory();
            }}
          />
        </PaginationContainer>
      </Container>
    );
  })
);

CategoryPage.propTypes = {};

export default CategoryPage;
