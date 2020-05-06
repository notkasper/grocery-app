/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import HeartSvg from '../assets/filledHeart.svg';

const storeProps = {
  jumbo: {
    headerColor: '#FDC513',
    label: 'Jumbo',
    textColor: '#000',
  },
  albert_heijn: {
    headerColor: '#00ADE6',
    label: 'Albert Heijn',
    textColor: '#fff',
  },
};

const Container = styled.div`
  width: 132px;
  margin: 0 5px;
`;

const CardContainer = styled.div`
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
`;

const Card = styled.div`
  margin-top: -8px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
  background: ${(props) => storeProps[props.storeName].headerColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-bottom: 10px;
`;

const StoreTag = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;

  display: flex;
  align-items: center;
  text-align: center;
  color: ${(props) => storeProps[props.storeName].textColor};
  overflow: hidden;
  white-space: nowrap;
`;

const AmountLabel = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: right;
  color: ${(props) => storeProps[props.storeName].textColor};
  overflow: hidden;
  white-space: nowrap;
`;

const CardContent = styled.div`
  box-sizing: border-box;
  background-color: white;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px;
  height: 132px;
  line-height: 105px;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
`;

const SubCard = styled.div`
  margin-top: 2px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductLabel = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 15px;
  white-space: nowrap;
  overflow: hidden;
`;

const FooterTextRight = styled.p`
  display: inline-block;
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #000000;
  width: 35px;
  text-align: right;
  padding: 0 3px;
`;

const FooterTextLeft = styled.p`
  display: inline-block;
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #000000;
`;

const Heart = styled(HeartSvg)`
  display: inline-block;
  width: 12px;
  height: 12px;
  fill: #44c062;
  margin-bottom: -1.5px;
`;

const FooterDiv = styled.div``;

const ProductCard = (props) => {
  const { id, storeName, amountText, image, title, cost, likes } = props;
  const history = useHistory();
  return (
    <Container>
      <CardContainer
        onClick={() => {
          history.push(`/product/${id}`);
        }}
      >
        <CardHeader storeName={storeName}>
          <StoreTag storeName={storeName}>
            {storeProps[storeName].label}
          </StoreTag>
          <AmountLabel storeName={storeName}>{amountText}</AmountLabel>
        </CardHeader>
        <Card>
          <CardContent>
            <CardImage src={image} alt="product foto" />
          </CardContent>
        </Card>
      </CardContainer>
      <SubCard>
        <ProductLabel>
          {title.length > 16 ? `${title.substring(0, 16)}..` : title}
        </ProductLabel>
        <CardFooter>
          <FooterDiv>
            <FooterTextLeft>{`€ ${cost}`}</FooterTextLeft>
          </FooterDiv>
          <FooterDiv>
            <FooterTextRight>{likes}</FooterTextRight>
            <Heart />
          </FooterDiv>
        </CardFooter>
      </SubCard>
    </Container>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  amountText: PropTypes.string.isRequired,
  image: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
};

export default ProductCard;
