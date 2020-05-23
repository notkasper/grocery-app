/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Checkmark from '../assets/checkmark.svg';

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

export default ListItem;
