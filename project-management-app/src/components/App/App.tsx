import { Routes, Route } from 'react-router-dom';
import { WelcomePage } from '../../pages/WelcomePage/WelcomePage';
import { MainPage } from '../../pages/MainPage/MainPage';
import { BoardPage } from '../../pages/BoardPage/BoardPage';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { SignUpPage } from '../../pages/SignUpPage/SignUpPage';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';

import { Layout } from './Layout';

import { RequireAuth } from '../../hoc/RequireAuth';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<WelcomePage />}></Route>
        <Route
          path="main"
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="board"
          element={
            <RequireAuth>
              <BoardPage />
            </RequireAuth>
          }
        ></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="signup" element={<SignUpPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
