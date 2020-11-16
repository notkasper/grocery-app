import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Analytics from './Analytics';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from './Drawer';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
});

const App = () => {
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
        <Container maxWidth="sm">
          <Router>
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route path="/Analytics">
                <Drawer />
                <Analytics />
              </Route>
            </Switch>
          </Router>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default App;
