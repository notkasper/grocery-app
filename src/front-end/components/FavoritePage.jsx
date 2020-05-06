/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Cross from '../assets/cross.svg';
import ProductCard from './ProductCard';
import PlusSvg from '../assets/plus.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-gap: 10px;
  min-height: calc(100vh - 100px);
  padding-bottom: 50px;

  .header {
    font-family: Work Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
  }
`;

const Fab = styled.div`
  position: fixed;
  background: #44c062;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 64px;
  height: 64px;
  border-radius: 100%;
  right: 0;
  bottom: 50px;
  margin: 10px;
`;

const Plus = styled(PlusSvg)`
  width: 30%;
  height: 30;
  margin: 35%;
  fill: white;
`;

const FavoritesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
  margin: 15px 0;
`;

const ProductShowcase = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  white-space: nowrap;
`;

const FavoritesRow = styled.div`
  overflow-x: auto;
  white-space: nowrap;

  .row-header {
    display: flex;
    justify-content: flex-start;

    .row-label {
      margin-left: 5px;
      margin-bottom: 5px;
    }

    .delete-button {
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: #adb5c2;
      fill: #fff;
      padding: 3px;
      margin-left: 5px;
    }
  }
`;

const AddFavoritePage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const loadFavorites = async () => {
      setLoading(true);
      await applicationStore.getFavorites();
      setLoading(false);
    };
    useEffect(() => {
      loadFavorites();
    }, []);
    return (
      <Container>
        <p className="header">Favorieten</p>
        {loading ? <p>Loading...</p> : null}
        <FavoritesContainer>
          {Object.values(applicationStore.favorites).map((favorite, index) => {
            return (
              <FavoritesRow key={index}>
                <div className="row-header">
                  <Cross
                    className="delete-button"
                    onClick={async () => {
                      await applicationStore.deleteFavorite(
                        favorite.favorite.id
                      );
                      await applicationStore.getFavorites();
                    }}
                  />
                  <p className="row-label">{`${favorite.favorite.term} in '${favorite.category.label}'`}</p>
                </div>
                <ProductShowcase>
                  {favorite.products.map((product) => (
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
              </FavoritesRow>
            );
          })}
        </FavoritesContainer>
        <Fab onClick={() => history.push('/add_favourite')}>
          <Plus />
        </Fab>
      </Container>
    );
  })
);

AddFavoritePage.propTypes = {};

export default AddFavoritePage;
