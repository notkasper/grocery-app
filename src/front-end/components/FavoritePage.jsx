import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PlusSvg from '../assets/plus.svg';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  margin-bottom: 50px;
  height: 100vh;
`;

const Fab = styled.div`
  background: #44c062;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 64px;
  height: 64px;
  border-radius: 100%;
  position: absolute;
  right: 0;
  bottom: 50px;
  margin: 10px;
`;

const Plus = styled(PlusSvg)`
  width: 50%;
  height: 50;
  margin: 25%;
  fill: white;
`;

const AddFavoritePage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const history = useHistory();

    return (
      <Container>
        <p>Favorites</p>
        <Fab onClick={() => history.push('/add_favourite')}>
          <Plus />
        </Fab>
      </Container>
    );
  })
);

AddFavoritePage.propTypes = {};

export default AddFavoritePage;
