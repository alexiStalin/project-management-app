import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';

type PropsType = {
  children: JSX.Element;
};

const RequireAuth = (props: PropsType) => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.authorization.auth);

  if (!auth) {
    return <Navigate to="/welcome" state={{ from: location }} />;
  }

  return props.children;
};

const RequireAuthSignIn = (props: PropsType) => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.authorization.auth);

  if (auth) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return props.children;
};

export { RequireAuth, RequireAuthSignIn };
