/* eslint-disable no-await-in-loop */
const admin = require('firebase-admin');

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
    users.push(newUsers);
  }
  res.status(200).send({ data: users });
};
