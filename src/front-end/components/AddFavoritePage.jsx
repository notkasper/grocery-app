import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import SearchSvg from '../assets/search.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  margin-bottom: 50px;
`;

const SearchBar = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 114px;
  height: 45px;
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;

  .search-field {
    height: 100%;
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-family: Work Sans;
    font-style: normal;
    font-weight: 200;
    font-size: 18px;
    line-height: 21px;
    color: #adb5c2;
    margin-left: 20px;
  }

  .search-icon {
    height: 60%;
    width: 40px;
    margin-top: 10px;
    margin-right: 10px;
    fill: #adb5c2;
    transform: scale(-1, 1);
  }
`;

let timeout;
const AddFavoritePage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [term, setTerm] = useState('');
    const search = async () => {
      const response = await applicationStore.getFavoriteOptions(term);
      if (response.error) {
        return;
      }
      const products = response.body.data;
      console.log(products);
    };
    return (
      <Container>
        <SearchBar>
          <input
            type="text"
            className="search-field"
            placeholder="Zoek product"
            value={term}
            onChange={(event) => {
              setTerm(event.target.value);
              if (timeout) {
                clearTimeout(timeout);
              }
              timeout = setTimeout(() => {
                search();
              }, 750);
            }}
          />
          <SearchSvg className="search-icon" />
        </SearchBar>
      </Container>
    );
  })
);

AddFavoritePage.propTypes = {};

export default AddFavoritePage;
