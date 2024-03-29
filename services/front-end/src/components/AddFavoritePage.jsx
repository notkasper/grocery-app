/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import SearchSvg from '../assets/search.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-template-columns: 1fr;
  margin-bottom: 50px;
  padding-top: 20px;
  min-height: calc(100vh - 130px);
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
    font-weight: 300;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
    margin-left: 20px;

    &::placeholder {
      color: #adb5c2;
    }
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
    const search = async (newTerm) => {
      if (newTerm.length < 3) {
        return;
      }
      const response = await applicationStore.getFavoriteOptions(newTerm);
      if (response.error) {
        return;
      }
      const { products, categories } = response.body.data;
      const res = {};
      categories.forEach((category) => {
        res[category.id] = { category, count: 0 };
      });
      products.forEach((product) => {
        if (!res[product.category]) {
          console.error(
            `Could not find category counter for category: ${product.category}`
          );
          return;
        }
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
              const newTerm = event.target.value;
              setTerm(newTerm);
              if (timeout) {
                clearTimeout(timeout);
              }
              timeout = setTimeout(() => {
                search(newTerm);
              }, 750);
            }}
          />
          <SearchSvg className="search-icon" />
        </SearchBar>
        <Results>
          {Object.keys(results)
            .sort((key1, key2) => {
              const count1 = results[key1].count;
              const count2 = results[key2].count;
              if (count1 < count2) return 1;
              if (count1 > count2) return -1;
              return 0;
            })
            .map((key) => (
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
