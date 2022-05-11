import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';

type PropsType = {
  children: JSX.Element;
};

interface LocationState {
  from: {
    pathname: string;
  };
}

const RequireAuth = (props: PropsType) => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.authorization.auth);

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return props.children;
};

const RequireAuthSignIn = (props: PropsType) => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.authorization.auth);

  if (auth) {
    return <Navigate to="/main" state={{ from: location }} />;
  }

  return props.children;
};

export { RequireAuth, RequireAuthSignIn };
