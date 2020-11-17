import React, { useState } from 'react';
import firebase from 'firebase/app';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Analytics from './Analytics';
import Users from './Users';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from './Drawer';
import Toolbar from './Toolbar';
import Products from './Products';
import UploadProducts from './UploadProducts';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: '240px',
  },
}));

const App = () => {
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  const classes = useStyles();
  firebase.auth().onAuthStateChanged(() => {
    if (!initialAuthCheck) {
      setInitialAuthCheck(true);
    }
  });
  if (!initialAuthCheck) {
    return null;
  }
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Toolbar />
          <Drawer />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route path="/Analytics">
                <Analytics />
              </Route>
              <Route path="/Users">
                <Users />
              </Route>
              <Route path="/Products">
                <Products />
              </Route>
              <Route path="/UploadProducts">
                <UploadProducts />
              </Route>
            </Switch>
          </Container>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
