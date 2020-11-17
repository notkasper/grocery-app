import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const CustomToolbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="sticky" className={classes.toolbar}>
      <Toolbar>
        <Typography variant="h6">Cheapskate Admin Panel</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
