import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  margin-bottom: 50px;
`;

const AddFavoritePage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;

    return (
      <Container>
        <p>Add favorite</p>
      </Container>
    );
  })
);

AddFavoritePage.propTypes = {};

export default AddFavoritePage;
