/* eslint-disable max-len */
import React from 'react';
import { observer, inject } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import styled from 'styled-components';

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyBEzn6azcPTX_qeXpw1x0rWMAMa9Vo_duw',
  authDomain: 'cheapskate-de9ef.firebaseapp.com',
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.

const Container = styled.div`
  background-color: #f1f6fa;
  height: 100vh;
`;

const Header = styled.p`
  padding: 25vh 0 10vh 0;
  font-family: Work Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 47px;
  text-align: center;
  color: #44c062;
`;

const AuthPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => {
          applicationStore.authenticated = true;
        },
      },
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };
    return (
      <Container>
        <Header>Dingen.</Header>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Container>
    );
  })
);

export default AuthPage;
