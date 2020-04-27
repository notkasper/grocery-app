import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #44c062;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 50px;
`;

const Title = styled.p`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  text-align: center;
  padding-top: 14px;
`;

const NavBar = () => {
  return (
    <Container>
      <Title>Dingen.</Title>
    </Container>
  );
};

export default NavBar;
