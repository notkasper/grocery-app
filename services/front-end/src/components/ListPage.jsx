/* eslint-disable object-curly-newline */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import Modal from './Modal';
import ListItem from './ListItem';

const storeProps = {
  jumbo: {
    headerColor: '#FDC513',
    label: 'Jumbo',
    textColor: '#000',
  },
  albert_heijn: {
    headerColor: '#00ADE6',
    label: 'Albert Heijn',
    textColor: '#fff',
  },
};

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 1rem;
  padding-bottom: 3rem;
  grid-gap: 10px;
  min-height: 100vh;

  .item-counter {
    font-weight: 300;
    font-size: 20px;
    line-height: 23px;

    color: #adb5c2;
  }
`;

const StoreLabel = styled.div`
  display: inline-block;
  background: ${(props) => storeProps[props.storeName].headerColor};
  color: ${(props) => storeProps[props.storeName].textColor};
  border-radius: 8px;
  padding: 2px 10px;
  margin-top: 6px;
`;

const Total = styled.div`
  margin: 2rem 0;

  .price-per-store {
    .store-price {
      display: flex;
      justify-content: space-between;
      p {
        display: inline-block;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.5rem;
        color: #adb5c2;
      }
    }
  }

  .bar {
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: #e5e5e5;
    margin: 4px 0;
  }

  .total-price {
    float: right;
    font-weight: bold;
    font-size: 20px;
    line-height: 23px;
    color: #44c062;
  }
`;

const getTotalItemsCount = (listItems) => {
  let count = 0;
  Object.keys(listItems).forEach((storeName) => {
    listItems[storeName].forEach(() => {
      count += 1;
    });
  });
  return count;
};

const getTotalForStore = (listItems, storeName) =>
  listItems[storeName].reduce(
    (acc, curr) => acc + Number.parseFloat(curr.product.new_price) * curr.count,
    0
  );

const ListPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [listItems, setListItems] = useState({});
    const [modalItem, setModalItem] = useState(null);
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
    return (
      <>
        <Container>
          <p className="item-counter">
            {`${getTotalItemsCount(listItems)} producten in uw lijstje`}
          </p>
          {Object.keys(listItems).map((storeName) => (
            <>
              <StoreLabel storeName={storeName}>
                {storeProps[storeName].label}
              </StoreLabel>
              {listItems[storeName].map((item) => (
                <ListItem
                  openModal={() => setModalItem(item)}
                  key={item.id}
                  id={item.id}
                  count={item.count}
                  image={item.product.image}
                  label={item.product.label}
                  discountText={item.product.discount_type}
                  newPrice={item.product.new_price}
                  oldPrice={item.product.old_price}
                />
              ))}
            </>
          ))}
          <Total>
            <div className="price-per-store">
              {Object.keys(listItems).map((storeName) => (
                <div className="store-price" key={storeName}>
                  <p>{storeProps[storeName].label}</p>
                  <p>{`€ ${getTotalForStore(listItems, storeName)}`}</p>
                </div>
              ))}
            </div>
            <div className="bar" />
            <p className="total-price">
              {`€ ${Object.keys(listItems).reduce(
                (acc, curr) => acc + getTotalForStore(listItems, curr),
                0
              )}`}
            </p>
          </Total>
        </Container>
        {!!modalItem && (
          <Modal
            close={() => {
              setModalItem(null);
              loadListItems();
            }}
            key={modalItem.id}
            id={modalItem.id}
            count={modalItem.count}
            image={modalItem.product.image}
            label={modalItem.product.label}
            discountText={modalItem.product.discount_type}
            newPrice={modalItem.product.new_price}
            oldPrice={modalItem.product.old_price}
          />
        )}
      </>
    );
  })
);

ListPage.propTypes = {};

export default ListPage;
