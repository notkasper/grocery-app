import React from 'react';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import NavBar from './NavBar';
import ExplorePage from './ExplorePage';

const PageContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
`;

const App = inject('applicationStore')(
  observer((props) => {
    console.info(props.applicationStore.foo);
    return (
      <Router>
        <NavBar />
        <PageContainer>
          <Switch>
            <Route path="/explore">
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
