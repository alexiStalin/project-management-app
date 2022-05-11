import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchUserByToken, tokenAdd } from '../../store/autorizationSlice';
import { WelcomePage } from '../../pages/WelcomePage/WelcomePage';
import { MainPage } from '../../pages/MainPage/MainPage';
import { BoardPage } from '../../pages/BoardPage/BoardPage';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { SignUpPage } from '../../pages/SignUpPage/SignUpPage';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';

import { Layout } from './Layout';

import { RequireAuth } from '../../hoc/RequireAuth';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (token !== '') {
      dispatch(fetchUserByToken(token));
      dispatch(tokenAdd(token));
    }
    // eslint-disable-next-line
  }, []);
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
