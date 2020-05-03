/* eslint-disable object-curly-newline */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import firebase from 'firebase';
import Footer from './Footer';
import NavBar from './NavBar';
import ExplorePage from './ExplorePage';
import AuthPage from './AuthPage';

const PageContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
`;

const App = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        applicationStore.authenticated = true;
      } else {
        applicationStore.authenticated = false;
      }
    });
    if (!applicationStore.authenticated) {
      return <AuthPage />;
    }
    return (
      <Router>
        <NavBar />
        <PageContainer>
          <Switch>
            <Route path="/" exact>
              <ExplorePage />
            </Route>
            <Route path="/favourites">
              <div>
                <p>FAVOURITES</p>
              </div>
            </Route>
            <Route path="/list">
              <div>
                <p>LIST</p>
              </div>
            </Route>
          </Switch>
        </PageContainer>
        <Footer />
      </Router>
    );
  })
);

App.propTypes = {};

export default App;
