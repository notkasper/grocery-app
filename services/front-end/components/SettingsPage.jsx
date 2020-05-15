/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import jsCookie from 'js-cookie';
import HomeSvg from '../assets/home.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-gap: 10px;
  padding-bottom: 10000px;
  height: 100vh;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;

  .icon-label-container {
    display: flex;
    justify-content: flex-start;
  }

  .icon {
    width: 32px;
    height: 32px;
    fill: #7a7a7a;
  }

  .label {
    margin-left: 8px;
    font-size: 18px;
    line-height: 32px;
    color: #7a7a7a;
    overflow: hidden;
    white-space: nowrap;
  }

  .dropdown {
    outline: none;
    background: none;
    color: #7a7a7a;
    font-family: Work Sans;
    border: 1px solid #7a7a7a;
    font-size: 18px;
    border-radius: 8px;
  }
`;

const Settingspage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [homepage, setHomepage] = useState('/');
    useEffect(() => {
      const homescreen = jsCookie.get('HOMEPAGE');
      applicationStore.navbarLabel = 'Instellingen';
      setHomepage(homescreen);
    }, []);
    return (
      <Container>
        <p>Instellingen</p>
        <Row>
          <div className="icon-label-container">
            <HomeSvg className="icon" />
            <p className="label">Start scherm</p>
          </div>
          <select
            value={homepage}
            className="dropdown"
            onChange={(event) => {
              setHomepage(event.target.value);
              jsCookie.set('HOMEPAGE', event.target.value);
            }}
          >
            <option value="/">Ontdek</option>
            <option value="/favorites">Favorieten</option>
          </select>
        </Row>
      </Container>
    );
  })
);

Settingspage.propTypes = {};

export default Settingspage;
