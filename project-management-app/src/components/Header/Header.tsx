import { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { logOut } from '../../store/autorizationSlice';
// import './Header.css';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';

const Header = () => {
  const auth = useAppSelector((state) => state.authorization.auth);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');

  const onChange = (e: SelectChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    i18next.changeLanguage(target.value);
    setLanguage(target.value);
  };

  let elements: JSX.Element;
  if (auth) {
    elements = (
      <>
        <Box sx={{ flexGrow: 4, display: 'flex' }}>
          <Button sx={{ my: 1, color: 'white', display: 'block' }}>
            <NavLink className="appLink" to="/" style={{ textDecoration: 'none' }}>
              {t('main')}
            </NavLink>
          </Button>
          <Button sx={{ my: 1, color: 'white', display: 'block' }}>
            <NavLink className="appLink" to="/welcome" style={{ textDecoration: 'none' }}>
              {t('welcome')}
            </NavLink>
          </Button>
        </Box>
        <Select
          sx={{ m: 1, color: 'white', width: 120, height: 38, borderColor: 'white' }}
          value={language}
          name="language"
          onChange={onChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ru">Русский</MenuItem>
        </Select>

        <Button
          color="inherit"
          onClick={() => {
            dispatch(logOut());
          }}
          variant="outlined"
          endIcon={<LogoutIcon color="inherit" />}
        >
          {t('log_out')}
        </Button>
      </>
    );
  } else {
    elements = (
      <>
        <Box mr={3}>
          <Select
            value={language}
            name="language"
            onChange={onChange}
            sx={{ m: 1, color: 'white', width: 120, height: 38, borderColor: 'white' }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
          </Select>

          <Button color="inherit" variant="outlined" startIcon={<LoginIcon color="inherit" />}>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              {t('log_in')}
            </NavLink>
          </Button>
        </Box>
        <Button color="inherit" variant="contained">
          <NavLink to="/signup" style={{ textDecoration: 'none' }}>
            {t('sign_up')}
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
