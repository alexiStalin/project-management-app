import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { logOut } from '../../store/autorizationSlice';
// import './Header.css';

const Header = () => {
  const auth = useAppSelector((state) => state.authorization.auth);
  const dispatch = useAppDispatch();

  let elements: JSX.Element;
  if (auth) {
    elements = (
      <>
        <Box sx={{ flexGrow: 4, display: 'flex' }}>
          <Button sx={{ my: 1, color: 'white', display: 'block' }}>
            <NavLink className="appLink" to="/" style={{ textDecoration: 'none' }}>
              Main
            </NavLink>
          </Button>
          <Button sx={{ my: 1, color: 'white', display: 'block' }}>
            <NavLink className="appLink" to="/welcome" style={{ textDecoration: 'none' }}>
              Welcome
            </NavLink>
          </Button>
        </Box>
        <Button
          color="inherit"
          onClick={() => {
            dispatch(logOut());
          }}
          variant="outlined"
          endIcon={<LogoutIcon color="inherit" />}
        >
          Log out
        </Button>
      </>
    );
  } else {
    elements = (
      <>
        <Box mr={3}>
          <Button color="inherit" variant="outlined" startIcon={<LoginIcon color="inherit" />}>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              Login
            </NavLink>
          </Button>
        </Box>
        <Button color="inherit" variant="contained">
          <NavLink to="/signup" style={{ textDecoration: 'none' }}>
            Sign Up
          </NavLink>
        </Button>
      </>
    );
  }
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            PMA
          </Typography>
          {elements}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export { Header };
