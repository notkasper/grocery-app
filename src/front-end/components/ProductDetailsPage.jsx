/* eslint-disable react/no-array-index-key */
import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-gap: 10px;
  padding-bottom: 10000px;
  height: 100vh;
`;

const ProductDetailsPage = inject('applicationStore')(
  observer(() => {
    return (
      <Container>
        <p>test</p>
      </Container>
    );
  })
);

ProductDetailsPage.propTypes = {};

export default ProductDetailsPage;
