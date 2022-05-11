import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="header">
    <NavLink className="appLink" to="/">
      Welcome
    </NavLink>
    <NavLink className="appLink" to="/main">
      Main
    </NavLink>
    <NavLink className="appLink" to="/board">
      Board
    </NavLink>
  </header>
);

export { Header };
