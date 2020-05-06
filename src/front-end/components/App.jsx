/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
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
import ProductDetailsPage from './ProductDetailsPage';
import CategoryPage from './CategoryPage';
import ListPage from './ListPage';
import Loader from './Loader';

const PageContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
`;

const LoaderContainer = styled.div`
  height: 50px;
  margin-top: calc(50vh - 50px);
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
    const [initialAuthCheck, setInitialAuthCheck] = useState(false);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        applicationStore.authenticated = true;
      } else {
        applicationStore.authenticated = false;
      }
      if (!initialAuthCheck) {
        setInitialAuthCheck(true);
      }
    });
    if (!initialAuthCheck) {
      return (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      );
    }
    if (!applicationStore.authenticated && initialAuthCheck) {
      return <AuthPage />;
    }
    return (
      <Router>
        <Test />
        <NavBar />
        <PageContainer>
          <Switch>
            <Route path="/" exact component={ExplorePage} />
            <Route path="/favorites" exact component={FavoritePage} />
            <Route path="/add_favourite" exact component={AddFavoritePage} />
            <Route path="/settings" exact component={SettingsPage} />
            <Route path="/list" exact component={ListPage} />
            <Route path="/product/:id" component={ProductDetailsPage} />
            <Route path="/categories/:id" component={CategoryPage} />
          </Switch>
        </PageContainer>
        <Footer />
      </Router>
    );
  })
);

App.propTypes = {};

export default App;
