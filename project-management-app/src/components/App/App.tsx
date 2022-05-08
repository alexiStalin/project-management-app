import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { WelcomePage } from '../../pages/WelcomePage/WelcomePage';
import { MainPage } from '../../pages/MainPage/MainPage';
import { BoardPage } from '../../pages/BoardPage/BoardPage';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { SignUpPage } from '../../pages/SignUpPage/SignUpPage';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<WelcomePage />}></Route>
        <Route path="main" element={<MainPage />}></Route>
        <Route path="board" element={<BoardPage />}></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="signup" element={<SignUpPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
