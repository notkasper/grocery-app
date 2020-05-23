/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(244, 248, 251, 0.7);
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

      .decrement {
        background: ${(props) => (props.count <= 1 ? '#ADB5C2' : '#44c062')};
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
      // oldPrice,
      newPrice,
      count: originalCount,
      id,
      discountText,
      close,
    } = props;
    const [inner, setInner] = useState(null);
    const [count, setCount] = useState(originalCount);
    const clickHandler = (event) => {
      const isClickInside = inner.contains(event.target);
      if (!isClickInside) {
        document.removeEventListener('click', clickHandler);
        close();
      }
    };
    useEffect(() => {
      document.addEventListener('click', clickHandler, []);
    });
    return (
      <ModalContainer key={id} count={count}>
        <div className="inner" ref={(element) => setInner(element)}>
          <div className="top">
            <img src={image} alt="foto van product" />
            <div className="product-info">
              <p className="label">{label}</p>
              {discountText && <p className="discount-text">{discountText}</p>}
              <p className="new-price">{`€ ${newPrice}`}</p>
            </div>
          </div>
          <div className="amount-controller">
            <button
              className="decrement"
              onClick={async () => {
                applicationStore.deleteListItem(id);
                setCount(count - 1);
              }}
              disabled={count <= 1}
            >
              -
            </button>
            <p className="count">{count}</p>
            <button
              onClick={async () => {
                applicationStore.addListItem(id);
                setCount(count + 1);
              }}
            >
              +
            </button>
          </div>
          <button
            className="remove-all"
            onClick={async () => {
              await applicationStore.deleteListItemAll(id);
              document.removeEventListener('click', clickHandler);
              close();
            }}
          >
            Verwijderen uit winkelmandje
          </button>
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
  close: PropTypes.func.isRequired,
};

Modal.defaultProps = { discountText: null, oldPrice: null };

export default Modal;
