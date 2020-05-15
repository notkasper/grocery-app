import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import SettingsSvg from '../assets/settings.svg';
import BackSvg from '../assets/back.svg';

const Container = styled.div`
  background-color: #44c062;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;

  .back-arrow {
    width: 24px;
    height: 24px;
    fill: #fff;
    margin-top: 13px;
  }
`;

const Title = styled.p`
  font-family: Work Sans;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  text-align: center;
  margin-top: 13px;
`;

const SettingsIcon = styled(SettingsSvg)`
  width: 24px;
  height: 24px;
  fill: #fff;
  margin-top: 13px;
`;

const NavBar = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const history = useHistory();
    return (
      <Container>
        {history.length ? (
          <BackSvg
            className="back-arrow"
            onClick={() => {
              history.goBack();
            }}
          />
        ) : (
          <p />
        )}
        <Title>{applicationStore.navbarLabel}</Title>
        <SettingsIcon
          onClick={() => {
            history.push('/settings');
          }}
        />
      </Container>
    );
  })
);

export default NavBar;
