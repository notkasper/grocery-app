/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

const Results = styled.div`
  width: 90%;
  display: grid;
  grid-template-columns: 1fr;
  margin: auto;
  grid-gap: 10px;
  margin-top: 20px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 15px 10px;

  .result-label {
    font-family: Work Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: #44c062;
  }

  .count-container {
    background: ${(props) => (props.count > 0 ? '#44c062' : '#ADB5C2')};
    border-radius: 55px;
    height: 21px;
    width: 30px;

    .count {
      font-family: Work Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: #ffffff;
      margin-top: 3.5px;
    }
  }
`;

let timeout;
const AddFavoritePage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const history = useHistory();
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const search = async () => {
      const response = await applicationStore.getFavoriteOptions(term);
      if (response.error) {
        return;
      }
      const { products, categories } = response.body.data;
      const res = {};
      categories.forEach((category) => {
        res[category.id] = { category, count: 0 };
      });
      products.forEach((product) => {
        res[product.category].count += 1;
      });
      setResults(res);
    };
    return (
      <Container>
        <SearchBar>
          <input
            type="text"
            className="search-field"
            placeholder="Zoek product"
            value={term}
            autoFocus
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
        <Results>
          {Object.keys(results).map((key) => (
            <ResultRow
              key={key}
              count={results[key].count}
              onClick={async () => {
                await applicationStore.addFavorite(key, term);
                applicationStore.getFavorites();
                history.push('/favorites');
              }}
            >
              <p className="result-label">{results[key].category.label}</p>
              <div className="count-container">
                <p className="count">{results[key].count}</p>
              </div>
            </ResultRow>
          ))}
        </Results>
      </Container>
    );
  })
);

AddFavoritePage.propTypes = {};

export default AddFavoritePage;
