import { AppBar, Box, Container, Toolbar, Link } from '@mui/material';
import schoolLogo from '../../assets/rs_school_js.svg';
import gitLogo from '../../assets/git.png';
// import './Footer.css';

const Footer = () => {
  return (
    <AppBar position="sticky" sx={{ bottom: 0 }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Box
            sx={{
              mr: 2,
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link target="_blank" rel="noopener" href="https://rs.school/react/">
              <img src={schoolLogo} style={{ width: '80px' }}></img>
            </Link>
            <p>© 2022 The Rolling Scopes</p>
            <Link
              variant="inherit"
              color="inherit"
              underline="hover"
              target="_blank"
              rel="noopener"
              href="https://github.com/alexiStalin"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <img src={gitLogo} style={{ width: '30px' }}></img>
                <span style={{ margin: '0 10px' }}>alexiStalin</span>
              </Box>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export { Footer };
