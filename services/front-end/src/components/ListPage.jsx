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

const ListItem = (props) => {
  const {
    image,
    id,
    label,
    count,
    discountText,
    oldPrice,
    newPrice,
    openModal,
  } = props;
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
        <span className="options" onClick={openModal}>
          <p className="dot" />
          <p className="dot" />
          <p className="dot" />
        </span>
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
  openModal: PropTypes.func.isRequired,
};

ListItem.defaultProps = { discountText: null, oldPrice: null };

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(244, 248, 251, 0.3);
  .inner {
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    width: 75%;
    margin: auto;
    margin-top: 30vh;
    padding: 20px 10px;

    .top {
      display: flex;
      justify-content: flex-start;
      img {
        width: 33%;
      }

      .product-info {
        width: 66%;
        margin-left: 10px;

        p {
          margin: 0.5rem 0;
        }

        .discount-text {
          display: inline-block;
          background: #44c062;
          border-radius: 8px;
          color: #fff;
          padding: 2px 10px;
          width: auto;
        }

        .new-price {
          font-size: 13px;
          line-height: 15px;

          color: #44c062;
        }
      }
    }

    .amount-controller {
      display: flex;
      justify-content: space-between;
      margin: 1.5rem 30%;

      button {
        outline: none;
        border: none;
        appearance: none;
        background: #44c062;
        border-radius: 8px;
        width: 2rem;
        height: 2rem;
        font-size: 24px;
        line-height: 28px;
        color: #ffffff;
      }

      p {
        font-size: 1.5rem;
        line-height: 2rem;
        text-align: center;
        color: #000000;
        vertical-align: middle;
      }
    }

    .remove-all {
      width: 80%;
      margin-left: 10%;
      border: 1px solid #c04c44;
      border-radius: 8px;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: #c04c44;
      background: none;
      height: 2rem;
    }
  }
`;

const Modal = inject('applicationStore')(
  observer((props) => {
    const {
      applicationStore,
      image,
      label,
      oldPrice,
      newPrice,
      count,
      id,
      discountText,
    } = props;
    return (
      <ModalContainer key={id}>
        <div className="inner">
          <div className="top">
            <img src={image} alt="foto van product" />
            <div className="product-info">
              <p className="label">{label}</p>
              <p className="discount-text">{discountText}</p>
              <p className="new-price">{`€ ${newPrice}`}</p>
            </div>
          </div>
          <div className="amount-controller">
            <button>-</button>
            <p className="count">{count}</p>
            <button>+</button>
          </div>
          <button className="remove-all">Verwijderen uit winkelmandje</button>
        </div>
      </ModalContainer>
    );
  })
);

Modal.propTypes = {
  oldPrice: PropTypes.number,
  newPrice: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  discountText: PropTypes.string,
};

Modal.defaultProps = { discountText: null, oldPrice: null };

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
    const getTotalItemsCount = () => {
      let count = 0;
      Object.keys(listItems).forEach((storeName) => {
        listItems[storeName].forEach(() => {
          count += 1;
        });
      });
      return count;
    };
    const getTotalForStore = (storeName) =>
      listItems[storeName].reduce(
        (acc, curr) =>
          acc + Number.parseFloat(curr.product.new_price) * curr.count,
        0
      );
    return (
      <>
        <Container>
          <p className="item-counter">{`${getTotalItemsCount()} producten in uw lijstje`}</p>
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
                  <p>{`€ ${getTotalForStore(storeName)}`}</p>
                </div>
              ))}
            </div>
            <div className="bar" />
            <p className="total-price">
              {`€ ${Object.keys(listItems).reduce(
                (acc, curr) => acc + getTotalForStore(curr),
                0
              )}`}
            </p>
          </Total>
        </Container>
        {!!modalItem && (
          <Modal
            closeModal={() => setModalItem(null)}
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
