import { useLocation, Navigate } from 'react-router-dom';

type PropsType = {
  children: JSX.Element;
};

const RequireAuth = (props: PropsType) => {
  const location = useLocation();

  const auth = true;

  if (!auth) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return props.children;
};

export { RequireAuth };
