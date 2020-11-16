import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const CustomToolbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.toolbar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Cheapskate Admin Panel</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
