/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Checkmark from '../assets/checkmark.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 1rem;
  grid-gap: 10px;
  padding-bottom: 10000px;
  height: 100vh;

  .item-counter {
    font-weight: 300;
    font-size: 20px;
    line-height: 23px;

    color: #adb5c2;
  }
`;

const ListItemContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;

  .image-container {
    background: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    max-width: 20vw;
    display: inline-block;
    img {
      max-width: 100%;
    }
  }

  .item-details {
    vertical-align: top;
    display: inline-block;
    margin-left: 0.5rem;

    .discount-tag {
      display: inline-block;
      background: #44c062;
      border-radius: 8px;
      color: #fff;
      padding: 2px 10px;
      width: auto;
    }

    .price-tag {
      margin: 0.25rem 0;
      font-weight: 600;
      color: #44c062;
      width: auto;
    }

    .label-tag {
      font-weight: 500;
    }
  }

  .checkbox {
    display: inline-block;
    margin: 0;
    padding: 0;
    appearance: none;
    border: 2px solid #44c062;
    border-radius: 8px;
    background: none;
    max-height: 2rem;
    min-width: 2rem;
  }

  .checkmark {
    display: inline-block;
    fill: #adb5c2;
    max-height: 2rem;
    min-width: 2rem;
  }
`;

const ListItem = (props) => {
  const { image, id } = props;
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  return (
    <ListItemContainer>
      <div
        className="image-container"
        onClick={() => {
          history.push(`/product/${id}`);
        }}
      >
        <img src={image} alt="product preview" />
      </div>
      <div className="item-details">
        <p className="label-tag">
          1x Super speciale Gember nuggets met sambal saus
        </p>
        <p className="price-tag">€ 0,99</p>
        <p className="discount-tag">2 voor de prijs van 1</p>
      </div>
      {checked ? (
        <Checkmark className="checkmark" onClick={() => setChecked(false)} />
      ) : (
        <input
          type="checkbox"
          className="checkbox"
          onClick={() => setChecked(true)}
        />
      )}
    </ListItemContainer>
  );
};

const ListPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [listItems, setListItems] = useState([]);
    const loadListItems = async () => {
      const newListItems = await applicationStore.getListItems();
      setListItems(newListItems);
    };
    useEffect(() => {
      applicationStore.navbarLabel = 'Boodschappenlijst';
      loadListItems();
    }, []);
    return (
      <Container>
        <p className="item-counter">{`${listItems.length} producten in uw lijstje`}</p>
        {listItems.map((item) => (
          <ListItem key={item.id} id={item.id} image={item.product.image} />
        ))}
      </Container>
    );
  })
);

ListPage.propTypes = {};

export default ListPage;
