import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EqualizerRoundedIcon from '@material-ui/icons/EqualizerRounded';
import { useHistory } from 'react-router-dom';
import FastfoodRoundedIcon from '@material-ui/icons/FastfoodRounded';
import CreateNewFolderRoundedIcon from '@material-ui/icons/CreateNewFolderRounded';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const CustomDrawer = () => {
  const classes = useStyles();
  const history = useHistory();
  const onClickDrawerItem = (key) => {
    history.push(key);
  };

  const navItems = {
    Analytics: <EqualizerRoundedIcon />,
    Users: <PeopleAltIcon />,
    Products: <FastfoodRoundedIcon />,
    UploadProducts: <CreateNewFolderRoundedIcon />,
  };
  return (
    <Drawer
      variant="permanent"
      open
      //   onClose={handleDrawerToggle}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {Object.keys(navItems).map((key) => (
            <ListItem button key={key} onClick={() => onClickDrawerItem(key)}>
              <ListItemIcon>{navItems[key]}</ListItemIcon>
              <ListItemText primary={key} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
