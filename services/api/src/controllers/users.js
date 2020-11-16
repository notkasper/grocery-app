/* eslint-disable no-await-in-loop */
const admin = require('firebase-admin');
const { User } = require('../models');

const PAGE_SIZE = 1000;

const getUserPage = async (nextPageToken) => {
  const listUsersResults = await admin
    .auth()
    .listUsers(PAGE_SIZE, nextPageToken);
  const users = listUsersResults.users.map((userRecord) => userRecord.toJSON());
  return [users, listUsersResults.pageToken];
};

exports.getUsers = async (req, res) => {
  const users = [];
  let [newUsers, nextPageToken] = await getUserPage();
  users.push(...newUsers);
  while (nextPageToken) {
    [newUsers, nextPageToken] = await getUserPage(nextPageToken);
    users.push(...newUsers);
  }
  res.status(200).send({ data: users });
};

exports.deleteUser = async (req, res) => {
  try {
    const { firebase_uid: id } = req.params;
    const user = await User.findOne({ where: { firebase_uid: id } });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    await admin.auth().deleteUser(id);
    await User.destroy({ where: { firebase_uid: id } });
    res.status(204).send({ message: 'DELETED' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
