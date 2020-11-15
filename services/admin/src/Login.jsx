import firebase from 'firebase/app';
import 'firebase/auth';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const config = {
  apiKey: 'AIzaSyBEzn6azcPTX_qeXpw1x0rWMAMa9Vo_duw',
  authDomain: 'cheapskate-de9ef.firebaseapp.com',
  // ...
};
firebase.initializeApp(config);

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20vh',
  },
}));

const createUiConfig = (loginCallback) => {
  return {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: loginCallback,
    },
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
};

const Login = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleLoginSucces = () => {
    console.log('Logged in!');
    history.push('/home');
  };
  return (
    <Box className={classes.box}>
      <StyledFirebaseAuth
        uiConfig={createUiConfig(handleLoginSucces)}
        firebaseAuth={firebase.auth()}
      />
    </Box>
  );
};

export default Login;
