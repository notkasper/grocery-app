/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import FilledHeartSvg from '../assets/filledHeart.svg';
import AlbertHeijnSvg from '../assets/albert_heijn.svg';
import JumboSvg from '../assets/jumbo.svg';

const getStoreSvg = (store) => {
  switch (store) {
    case 'albert_heijn':
      return <AlbertHeijnSvg className="store-logo" />;
    case 'jumbo':
      return <JumboSvg className="store-logo" />;
    default:
      return null;
  }
};

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-gap: 10px;
  height: calc(100vh - 100px);
`;

const ImageContainer = styled.div`
  width: 50%;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  margin: 10px auto 0 auto;
  position: relative;
  z-index: 10;

  .image {
    box-sizing: border-box;
    margin: 5%;
    width: 90%;
    padding: 20px;
  }
`;

const DetailsContainer = styled.div`
  width: 90%;
  height: auto;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  margin-top: -25vw;
  padding: 25vw 5% 5% 5%;

  .label {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 200;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #000000;
    margin-top: 10px;
  }

  .meta-details {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;

    .price-details {
      .old-price {
        font-family: Work Sans;
        font-style: normal;
        font-weight: 300;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        color: #000000;
        text-align: left;
      }
      .new-price {
        font-family: Work Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 36px;
        line-height: 42px;
        color: #44c062;
        text-align: left;
      }
    }

    .like-details {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .heart {
        fill: #44c062;
        width: 32px;
        height: 32px;
      }

      .likes-amount {
        font-family: Work Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        height: 32px;
        margin: 0 10px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000000;
      }
    }
  }

  .description-container {
    margin: 20px 0;

    .header {
      font-family: Work Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #000000;
    }
    .description {
      font-family: Work Sans;
      font-style: normal;
      font-weight: 300;
      font-size: 14px;
      line-height: 16px;
      color: #000000;
      margin: 5px 0;
    }
  }

  .footer-container {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .availability-container {
      .availability-header {
        font-family: Work Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000000;
      }

      .availability {
        font-family: Work Sans;
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 16px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000000;
      }
    }

    .store-container {
      .store-header {
        font-family: Work Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000000;
      }

      .store-name {
        font-family: Work Sans;
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 16px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000000;
      }
    }
  }
`;

const ProductDetailsPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const product = applicationStore.products[props.match.params.id];
    const [loading, setLoading] = useState(false);
    const loadProducts = async () => {
      // load specific product...
      setLoading(true);
      await applicationStore.getProducts();
      setLoading(false);
    };
    useEffect(() => {
      loadProducts();
    }, []);
    if (loading || !product) {
      return (
        <Container>
          <p>loading...</p>
        </Container>
      );
    }
    return (
      <Container>
        <ImageContainer>
          <img src={product.image} className="image" alt={product.label} />
        </ImageContainer>
        <DetailsContainer>
          <p className="label">{product.label}</p>
          <div className="meta-details">
            <div className="price-details">
              <p className="old-price">{`€${product.old_price || '??'}`}</p>
              <p className="new-price">{`€${product.new_price || '??'}`}</p>
            </div>
            <div className="like-details">
              <p className="likes-amount">{product.likes || '??'}</p>
              <FilledHeartSvg className="heart" />
            </div>
          </div>
          <div className="description-container">
            <p className="header">Beschrijving</p>
            <p className="description">{product.label}</p>
          </div>
          <div className="footer-container">
            <div className="availability-container">
              <p className="availability-header">Geldig tot</p>
              <p className="availability">4 April 2020</p>
            </div>
            <div className="store-container">
              <p className="store-header">Winkel</p>
              <p className="store-name">
                {product.store_name.replace('_', ' ')}
              </p>
            </div>
          </div>
        </DetailsContainer>
      </Container>
    );
  })
);

ProductDetailsPage.propTypes = {};

export default ProductDetailsPage;
