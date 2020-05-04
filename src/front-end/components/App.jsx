/* eslint-disable object-curly-newline */
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { observer, inject } from 'mobx-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';
import jsCookie from 'js-cookie';
import Footer from './Footer';
import NavBar from './NavBar';
import ExplorePage from './ExplorePage';
import AuthPage from './AuthPage';
import AddFavoritePage from './AddFavoritePage';
import FavoritePage from './FavoritePage';
import SettingsPage from './SettingsPage';

const PageContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
`;

let firstRender = true;

const Test = () => {
  const history = useHistory();
  if (firstRender) {
    history.push(jsCookie.get('HOMEPAGE'));
  }
  firstRender = false;
  return null;
};

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
        <Test />
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
            <Route path="/settings" exact>
              <SettingsPage />
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
