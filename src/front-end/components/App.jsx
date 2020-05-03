/* eslint-disable object-curly-newline */
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import NavBar from './NavBar';
import ExplorePage from './ExplorePage';
import AuthPage from './AuthPage';
import AddFavoritePage from './AddFavoritePage';
import FavoritePage from './FavoritePage';

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
            <Route path="/favorites" exact>
              <FavoritePage />
            </Route>
            <Route path="/add_favourite" exact>
              <AddFavoritePage />
            </Route>
            <Route path="/list" exact>
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
