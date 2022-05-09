import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import './Header.css';

const Header = () => {
  const auth = useAppSelector((state) => state.authorization.auth);
  let elements: JSX.Element;
  if (auth) {
    elements = (
      <>
        <NavLink className="appLink" to="/">
          Welcome
        </NavLink>
        <NavLink className="appLink" to="/main">
          Main
        </NavLink>
        <NavLink className="appLink" to="/board">
          Board
        </NavLink>
      </>
    );
  } else {
    elements = (
      <>
        <NavLink className="appLink" to="/login">
          Login
        </NavLink>
        <NavLink className="appLink" to="/signup">
          Sign Up
        </NavLink>
      </>
    );
  }
  return <header className="header">{elements}</header>;
};

export { Header };
