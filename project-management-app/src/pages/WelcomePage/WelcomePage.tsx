import { NavLink } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div>
      <div style={{ margin: '20px', textAlign: 'right' }}>
        <NavLink to="/login" style={styleBtn}>
          Login
        </NavLink>
        <NavLink to="/signup" style={styleBtn}>
          Sign up
        </NavLink>
      </div>
      <h1> Welcome, friend</h1>
    </div>
  );
};
const styleBtn = {
  marginRight: '10px',
  textDecoration: 'none',
  padding: '5px 20px',
  border: 'solid 1px black',
  borderRadius: '3px',
};

export { WelcomePage };
