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
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { getIdToken } from './utils';

const UserListItem = ({ user, onClickDelete, onClickInfo }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar src={user.photoURL || user.providerData[0].photoURL} />
    </ListItemAvatar>
    <ListItemText
      primary={user.displayName}
      secondary={`Joined at: ${user.metadata.creationTime}`}
    />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        color="primary"
        aria-label="delete"
        onClick={() => onClickInfo(user)}
      >
        <InfoRoundedIcon />
      </IconButton>
      <IconButton
        edge="end"
        color="secondary"
        aria-label="delete"
        onClick={() => onClickDelete(user)}
      >
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const ConfirmDialog = ({ user, open, handleClose, handleDelete }) => {
  if (!user) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are you sure you want to delete this user? (${user.displayName})`}
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

const Field = ({ label, value }) => (
  <Grid item xs={6}>
    <TextField
      label={label}
      id={label}
      value={value}
      style={{ width: '95%', margin: '2.5%' }}
      disabled
    />
  </Grid>
);

const InfoDialog = ({ user, open, handleClose }) => {
  if (!user) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{user.displayName}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Field label="disabled" value={user.disabled} />
          <Field label="displayName" value={user.displayName} />
          <Field label="email" value={user.email} />
          <Field label="emailVerified" value={user.emailVerified} />
          <Field
            label="tokensValidAfterTime"
            value={user.tokensValidAfterTime}
          />
          <Field label="uid" value={user.uid} />
          {Object.keys(user.metadata).map((key) => (
            <Field label={key} value={user.metadata[key]} />
          ))}
          {user.providerData.map((data) =>
            Object.keys(data).map((key) => (
              <Field label={key} value={data[key]} />
            ))
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
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
  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);
  const handleInfoDialogClose = () => setInfoDialogOpen(false);
  const handleDeleteUser = async () => {
    try {
      const idToken = await getIdToken();
      await request
        .delete(`api/v1/users/${user.uid}`)
        .set('authorization', `Bearer ${idToken}`);
      handleDeleteDialogClose();
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
  const handleDeleteDialog = (selectedUser) => {
    setUser(selectedUser);
    setDeleteDialogOpen(true);
  };
  const handleInfoDialog = (selectedUser) => {
    setUser(selectedUser);
    setInfoDialogOpen(true);
  };
  return (
    <Box>
      <Typography>{`${users.length} users`}</Typography>
      <List>
        {users.map((user) => (
          <UserListItem
            user={user}
            onClickDelete={handleDeleteDialog}
            onClickInfo={handleInfoDialog}
          />
        ))}
      </List>
      <ConfirmDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        handleDelete={handleDeleteUser}
        user={user}
      />
      <InfoDialog
        open={infoDialogOpen}
        handleClose={handleInfoDialogClose}
        // handleDelete={handleDeleteUser}
        user={user}
      />
    </Box>
  );
};

export default Users;
