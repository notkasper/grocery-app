import firebase from 'firebase/app';
import 'firebase/auth';

export const getIdToken = async () => {
  const idToken = await firebase.auth().currentUser.getIdToken();
  return idToken;
};
