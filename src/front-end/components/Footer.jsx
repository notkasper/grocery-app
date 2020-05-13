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
    const { location } = history;
    console.info('===============');
    console.info(location.pathname);
    console.info(location.pathname);
    console.info(location.pathname);
    return (
      <Container>
        <NavItem
          onClick={() => {
            history.push('/');
            applicationStore.navbarLabel = 'Dingen.';
          }}
        >
          {location.pathname === '/' ? <ShopFilled /> : <Shop />}
        </NavItem>
        <NavItem
          onClick={() => {
            history.push('/favorites');
            applicationStore.navbarLabel = 'Favorieten';
          }}
        >
          {location.pathname === '/favorites' ? <HeartFilled /> : <Heart />}
        </NavItem>
        <NavItem
          onClick={() => {
            history.push('/list');
            applicationStore.navbarLabel = 'Boodschappenlijst';
          }}
        >
          {location.pathname === '/list' ? <ChecklistFilled /> : <Checklist />}
        </NavItem>
      </Container>
    );
  })
);

export default Footer;
