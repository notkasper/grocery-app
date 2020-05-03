const admin = require('firebase-admin');
const serviceAccount = require('../../../cheapskate-de9ef-firebase-adminsdk-epf27-b8db0c1de0');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cheapskate-de9ef.firebaseio.com',
});

module.exports = async (req, res, next) => {
  try {
    const idToken = req.headers.id_token;
    if (!idToken) {
      res.status(401).send({ error: 'Please send an id token' });
      return;
    }
    const user = await admin.auth().verifyIdToken(idToken);
    if (!user) {
      res.status(401).send({ error: 'User not found' });
    }
    res.user = user;
    next();
  } catch (error) {
    res.status(500).send({ success: false, data: {} });
  }
};
