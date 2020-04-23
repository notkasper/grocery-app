import React from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import heartSvg from '../assets/heart.svg';

const ProductCard = (props) => {
  const { applicationStore, storeName, amountText, image, title, cost, likes } = props;
  const storeProps = {
    jumbo: { headerColor: '#FDC513', label: 'Jumbo', textColor: '#000' },
    albertHeijn: { headerColor: '#00ADE6', label: 'Albert Heijn', textColor: '#fff' },
  };

  const Container = styled.div`
    width: 132px;
  `;

  const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 2px 10px;
    background: ${storeProps[storeName].headerColor};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `;

  const StoreTag = styled.p`
    font-family: Work Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    /* identical to box height */

    display: flex;
    align-items: center;
    text-align: center;
    color: ${storeProps[storeName].textColor};
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
    color: ${storeProps[storeName].textColor};
  `;

  const Card = styled.div``;

  const CardContent = styled.div`
    box-sizing: border-box;
    background-color: white;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
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
    text-align: center;
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

  const Svg = styled.svg`
    display: inline-block;
    width: 13px;
    height: 13px;
    fill: #44c062;
    margin-bottom: -1.5px;
  `;

  const FooterDiv = styled.div``;
  return (
    <Container>
      <CardHeader>
        <StoreTag>{storeProps[storeName].label}</StoreTag>
        <AmountLabel>1 kg</AmountLabel>
      </CardHeader>
      <Card>
        <CardContent>
          <CardImage src={image} alt="product foto" />
        </CardContent>
      </Card>
      <SubCard>
        <ProductLabel>Super speciale gember</ProductLabel>
        <CardFooter>
          <FooterDiv>
            <FooterTextLeft>€ 0.99</FooterTextLeft>
          </FooterDiv>
          <FooterDiv>
            <FooterTextRight>647</FooterTextRight>
            <Svg viewBox="0 0 512 512">
              <path
                d="M376,30c-27.783,0-53.255,8.804-75.707,26.168c-21.525,16.647-35.856,37.85-44.293,53.268
                  c-8.437-15.419-22.768-36.621-44.293-53.268C189.255,38.804,163.783,30,136,30C58.468,30,0,93.417,0,177.514
                  c0,90.854,72.943,153.015,183.369,247.118c18.752,15.981,40.007,34.095,62.099,53.414C248.38,480.596,252.12,482,256,482
                  s7.62-1.404,10.532-3.953c22.094-19.322,43.348-37.435,62.111-53.425C439.057,330.529,512,268.368,512,177.514
                  C512,93.417,453.532,30,376,30z"
              />
            </Svg>
          </FooterDiv>
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
