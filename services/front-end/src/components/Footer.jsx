import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import Shop from '../assets/shop.svg';
import ShopFilled from '../assets/shopfilled.svg';
import Checklist from '../assets/checklist.svg';
import ChecklistFilled from '../assets/checklistfilled.svg';
import Heart from '../assets/heart.svg';
import HeartFilled from '../assets/filledheart.svg';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #44c062;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-around;
`;

const NavItem = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  text-align: center;
  padding-top: 10px;

  svg {
    width: 30px;
    height: 30px;
    fill: ${(props) => (props.selected ? '#fff' : '#fff')};
  }
`;

const Footer = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const history = useHistory();
    return (
      <Container>
        <NavItem
          onClick={() => {
            history.push('/');
            applicationStore.navbarLabel = 'Dingen.';
          }}
        >
          {applicationStore.navbarLabel === 'Dingen.' ? (
            <ShopFilled />
          ) : (
            <Shop />
          )}
        </NavItem>
        <NavItem
          onClick={() => {
            history.push('/favorites');
            applicationStore.navbarLabel = 'Favorieten';
          }}
        >
          {applicationStore.navbarLabel === 'Favorieten' ? (
            <HeartFilled />
          ) : (
            <Heart />
          )}
        </NavItem>
        <NavItem
          onClick={() => {
            history.push('/list');
            applicationStore.navbarLabel = 'Boodschappenlijst';
          }}
        >
          {applicationStore.navbarLabel === 'Boodschappenlijst' ? (
            <ChecklistFilled />
          ) : (
            <Checklist />
          )}
        </NavItem>
      </Container>
    );
  })
);

export default Footer;
