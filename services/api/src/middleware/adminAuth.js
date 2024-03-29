/* eslint-disable object-curly-newline */
const admin = require('firebase-admin');
const uuid = require('uuid');
const db = require('../models');

const admins = ['e8awiZ2ez7NN59pDB3kAymc2vpU2'];

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send({ error: 'Please send an Authorization header' });
      return;
    }
    const [type, idToken] = authHeader.split(' ');
    if (type !== 'Bearer') {
      res
        .status(401)
        .send({ error: 'Please send an authorization header with bearer' });
      return;
    }
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
    if (admins.indexOf(user.firebase_uid) === -1) {
      res.status(407).send({ error: 'Unauthorized' });
      return;
    }
    req.user = user;
    req.firebaseUser = firebaseUser;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: 'Something went wrong, please try again later' });
  }
};
