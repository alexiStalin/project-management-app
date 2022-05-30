import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

import './App.css';

const Layout = () => {
  return (
    <>
      <Header />
      <div className="layout">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export { Layout };
