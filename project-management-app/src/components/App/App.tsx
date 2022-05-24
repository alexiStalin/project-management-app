import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchUserByToken, tokenAdd, savePassword } from '../../store/autorizationSlice';
import { WelcomePage } from '../../pages/WelcomePage/WelcomePage';
import { MainPage } from '../../pages/MainPage/MainPage';
import BoardPage from '../../pages/BoardPage/BoardPage';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { SignUpPage } from '../../pages/SignUpPage/SignUpPage';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';

import { Layout } from './Layout';

import { RequireAuth, RequireAuthSignIn } from '../../hoc/RequireAuth';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const password = localStorage.getItem('password') || null;
    if (token !== '' && password !== null) {
      dispatch(fetchUserByToken(token));
      dispatch(tokenAdd(token));
      dispatch(savePassword(password));
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        ></Route>
        <Route path="welcome" element={<WelcomePage />}></Route>
        <Route
          path="board"
          element={
            <RequireAuth>
              <BoardPage />
            </RequireAuth>
          }
        ></Route>
        <Route path="board/:boardId" element={<BoardPage />}></Route>
        <Route
          path="login"
          element={
            <RequireAuthSignIn>
              <LoginPage />
            </RequireAuthSignIn>
          }
        ></Route>
        <Route
          path="signup"
          element={
            <RequireAuthSignIn>
              <SignUpPage />
            </RequireAuthSignIn>
          }
        ></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
