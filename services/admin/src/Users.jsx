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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getIdToken } from './utils';

const UserListItem = ({ user, onClickDelete }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar src={user.photoURL || user.providerData[0].photoURL} />
    </ListItemAvatar>
    <ListItemText
      primary={user.displayName}
      secondary={`Joined at: ${user.metadata.creationTime}`}
    />
    <ListItemSecondaryAction onClick={onClickDelete}>
      <IconButton edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const ConfirmDialog = ({ user, open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are you sure you want to delete this user? (${
          user?.displayName || ''
        })`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting is permanent and all data will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
  const handleDialogClose = () => setDialogOpen(false);
  const handleDeleteUser = async () => {
    try {
      const idToken = await getIdToken();
      await request
        .delete(`api/v1/users/${user.uid}`)
        .set('authorization', `Bearer ${idToken}`);
      handleDialogClose();
      setUser(null);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => loadUsers(), []);
  if (loading) {
    return <CircularProgress />;
  }
  const handleDialogOpen = (selectedUser) => {
    setUser(selectedUser);
    setDialogOpen(true);
  };
  return (
    <Box>
      <Typography>{`${users.length} users`}</Typography>
      <List>
        {users.map((user) => (
          <UserListItem
            user={user}
            onClickDelete={() => handleDialogOpen(user)}
          />
        ))}
      </List>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleDelete={handleDeleteUser}
        user={user}
      />
    </Box>
  );
};

export default Users;
