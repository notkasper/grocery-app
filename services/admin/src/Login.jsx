import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20vh',
  },
  marginTop: {
    marginTop: '.5rem',
  },
  marginBottom: {
    marginBottom: '1.5rem',
  },
  login: {
    marginTop: '1rem',
    float: 'right',
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const handleLogin = () => {
    console.log('Attempt to login...');
    // make login call
    history.push('/home');
  };
  return (
    <Box className={classes.box}>
      <FormControl>
        <Grid>
          <Grid item xs={12} className={classes.marginBottom}>
            <FormLabel>Admin Login</FormLabel>
          </Grid>
          <Grid item xs={12} className={classes.marginTop}>
            <TextField
              id="standard-basic"
              label="Username"
              autoFocus
              value={username}
              onChange={onChangeUsername}
            />
          </Grid>
          <Grid item xs={12} className={classes.marginTop}>
            <TextField
              id="standard-basic"
              label="Password"
              type="password"
              value={password}
              onChange={onChangePassword}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.login}>
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default Login;
