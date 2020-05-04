/* eslint-disable object-curly-newline */
const admin = require('firebase-admin');
const uuid = require('uuid');
const db = require('../models');
const serviceAccount = require('../../../cheapskate-de9ef-firebase-adminsdk-epf27-b8db0c1de0');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cheapskate-de9ef.firebaseio.com',
});

module.exports = async (req, res, next) => {
  try {
    console.log('HEADERS');
    console.log(req.headers);
    const idToken = req.headers.id_token;
    if (!idToken) {
      res.status(401).send({ error: 'Please send an id token' });
      return;
    }
    const firebaseUser = await admin.auth().verifyIdToken(idToken);
    if (!firebaseUser) {
      res.status(401).send({ error: 'User not found' });
      return;
    }
    let user = await db.User.findOne({
      where: { firebase_uid: firebaseUser.uid },
    });
    if (!user) {
      user = await db.User.create({
        id: uuid.v4(),
        firebase_uid: firebaseUser.uid,
      });
    }
    req.user = user;
    res.firebaseUser = firebaseUser;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: 'Something went wrong, please try again later' });
  }
};
