/* eslint-disable object-curly-newline */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Checkmark from '../assets/checkmark.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 1rem;
  grid-gap: 10px;
  min-height: 100vh;

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

  .left {
    display: flex;
    justify-content: flex-start;
    .image-container {
      background: #ffffff;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      min-width: 20vw;
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
        background-color: ${(props) => (props.checked ? '#ADB5C2' : '#44C062')};
        display: inline-block;
        border-radius: 8px;
        color: #fff;
        padding: 2px 10px;
        width: auto;
      }

      .price-tag {
        color: ${(props) => (props.checked ? '#ADB5C2' : '#44C062')};
        margin: 0.25rem 0;
        font-weight: 600;
        width: auto;
      }

      .label-tag-container {
        span {
          color: ${(props) => (props.checked ? '#ADB5C2' : '#000')};
          font-weight: 500;
        }

        .label-tag-count {
          color: ${(props) => (props.checked ? '#ADB5C2' : '#44C062')};
        }
      }
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
    .checkbox {
      margin-left: 10px;
      display: inline-block;
      padding: 0;
      border: 2px solid #44c062;
      border-radius: 8px;
      background: none;
      max-height: 2rem;
      min-width: 2rem;
    }

    .checkmark {
      margin-left: 10px;
      display: inline-block;
      fill: #adb5c2;
      max-height: 2rem;
      min-width: 2rem;
    }

    .options {
      margin-left: 20px;
      max-height: 2rem;
      margin-top: 0.3rem;
      .dot {
        margin-bottom: 0.3rem;
        border-radius: 20px;
        background-color: #adb5c2;
        width: 5px;
        height: 5px;
      }
    }
  }
`;

const ListItem = (props) => {
  const { image, id, label, count, discountText, oldPrice, newPrice } = props;
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  return (
    <ListItemContainer checked={checked}>
      <div className="left">
        <div
          className="image-container"
          onClick={() => {
            history.push(`/product/${id}`);
          }}
        >
          <img src={image} alt="product preview" />
        </div>
        <div className="item-details">
          <p className="label-tag-container">
            <span className="label-tag-count">{`${count}x `}</span>
            <span className="label-tag">{label}</span>
          </p>
          <p className="price-tag">{`€ ${newPrice}`}</p>
          {discountText && <p className="discount-tag">{discountText}</p>}
        </div>
      </div>
      <div className="right">
        {checked ? (
          <Checkmark className="checkmark" onClick={() => setChecked(false)} />
        ) : (
          <div
            type="checkbox"
            className="checkbox"
            onClick={() => setChecked(true)}
          />
        )}
      </div>
    </ListItemContainer>
  );
};

ListItem.propTypes = {
  oldPrice: PropTypes.number,
  newPrice: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  discountText: PropTypes.string,
};

ListItem.defaultProps = { discountText: null, oldPrice: null };

const ListPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [listItems, setListItems] = useState({});
    const loadListItems = async () => {
      const newListItems = await applicationStore.getListItems();
      const sortedListItems = {};
      newListItems.forEach((item) => {
        if (!sortedListItems[item.product.store_name]) {
          sortedListItems[item.product.store_name] = [];
          sortedListItems[item.product.store_name].push(item);
          return;
        }
        sortedListItems[item.product.store_name].push(item);
      });
      setListItems(sortedListItems);
    };
    useEffect(() => {
      applicationStore.navbarLabel = 'Boodschappenlijst';
      loadListItems();
    }, []);
    const getTotalItemsCount = () => {
      let count = 0;
      Object.keys(listItems).forEach((storeName) => {
        listItems[storeName].forEach(() => {
          count += 1;
        });
      });
      return count;
    };
    return (
      <Container>
        <p className="item-counter">{`${getTotalItemsCount()} producten in uw lijstje`}</p>
        {Object.keys(listItems).map((storeName) =>
          listItems[storeName].map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              count={item.count}
              image={item.product.image}
              label={item.product.label}
              discountText={item.product.discount_type}
              newPrice={item.product.new_price}
              oldPrice={item.product.old_price}
            />
          ))
        )}
      </Container>
    );
  })
);

ListPage.propTypes = {};

export default ListPage;
