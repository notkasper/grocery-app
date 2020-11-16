import { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import request from 'superagent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getIdToken } from './utils';

const UserListItem = ({ user }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar src={user.photoURL || user.providerData[0].photoURL} />
    </ListItemAvatar>
    <ListItemText
      primary={user.displayName}
      secondary={`Joined at: ${user.metadata.creationTime}`}
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadUsers = async () => {
    try {
      setLoading(true);
      const idToken = await getIdToken();
      const response = await request
        .get('api/v1/users')
        .set('authorization', `Bearer ${idToken}`);
      const users = response.body.data;
      setUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => loadUsers(), []);
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Typography>{`${users.length} users`}</Typography>
      <List>
        {users.map((user) => (
          <UserListItem user={user} />
        ))}
      </List>
    </Box>
  );
};

export default Users;
