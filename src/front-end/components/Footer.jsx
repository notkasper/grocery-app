import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import ShopSvg from '../assets/shop.svg';
import ChecklistSvg from '../assets/checklist.svg';
import HeartSvg from '../assets/heart.svg';

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
`;

const Shop = styled(ShopSvg)`
  width: 30px;
  height: 30px;
  fill: ${(props) => (props.selected ? '#fff' : '#fff')};
`;

const Checklist = styled(ChecklistSvg)`
  width: 30px;
  height: 30px;
  fill: ${(props) => (props.selected ? '#fff' : '#fff')};
`;

const Heart = styled(HeartSvg)`
  width: 30px;
  height: 30px;
  fill: ${(props) => (props.selected ? '#fff' : '#fff')};
`;

const Footer = () => {
  const history = useHistory();
  const { location } = history;
  return (
    <Container>
      <NavItem onClick={() => history.push('/')}>
        <Shop selected={location.pathname === '/'} />
      </NavItem>
      <NavItem onClick={() => history.push('/favorites')}>
        <Heart selected={location.pathname === '/favorites'} />
      </NavItem>
      <NavItem onClick={() => history.push('/list')}>
        <Checklist selected={location.pathname === '/list'} />
      </NavItem>
    </Container>
  );
};

export default Footer;
