import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { logOut } from '../../store/autorizationSlice';
import './Header.css';

const Header = () => {
  const auth = useAppSelector((state) => state.authorization.auth);
  const dispatch = useAppDispatch();

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
        <button
          onClick={() => {
            dispatch(logOut());
          }}
        >
          Log out
        </button>
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
