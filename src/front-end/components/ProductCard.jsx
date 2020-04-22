import React from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gember from '../assets/gember.png';

const Container = styled.div``;

const Card = styled.div`
  border-radius: 20px;
  background-color: white;
`;

const CardContent = styled.div`
  background-color: red;
`;

const SubCard = styled.div`
  background-color: #fff;
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: yellow;
`;

const CardFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ProductLabel = styled.p`
  color: black;
  font-size: 1.5em;
`;

const P = styled.p`
  color: black;
`;

const ProductCard = (props) => {
  const { applicationStore, storeName, amountText, image, title, cost, likes } = props;
  console.info(applicationStore, storeName, amountText, image, title, cost, likes);
  return (
    <Container>
      <CardHeader>
        <p>Jumbo</p>
        <p>1 kg</p>
      </CardHeader>
      <Card>
        <CardContent>
          <img src={gember} alt="product foto" />
        </CardContent>
      </Card>
      <SubCard>
        <ProductLabel>Super speciale gember</ProductLabel>
        <CardFooter>
          <P>$0.99</P>
          <P>647</P>
        </CardFooter>
      </SubCard>
    </Container>
  );
};

ProductCard.propTypes = {
  applicationStore: MobxPropTypes.observableObject.isRequired,
  storeName: PropTypes.string.isRequired,
  amountText: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired, // TODO: check if this is proper usage
  title: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
};

export default ProductCard;
