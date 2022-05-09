import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchSignIn, fetchUserByToken } from '../../store/autorizationSlice';
import s from '../SignUpPage/SignUpPage.module.css';

// localStorage.setItem(LocalStorageKeys.token, token);
// localStorage.getItem(LocalStorageKeys.token);

type Data = {
  login: string;
  password: string;
};

interface LocationState {
  from: {
    pathname: string;
  };
}

const LoginPage = () => {
  const {
    register,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<Data>({
    mode: 'onChange',
    shouldUnregister: true,
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = (location.state as LocationState)?.from || '/';

  const onSubmit = (data: Data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchSignIn(data)).then((data: any) => dispatch(fetchUserByToken(data.payload.token)));
    reset();
    navigate(fromPage, { replace: true });
  };

  return (
    <div className={s.loginPage}>
      <div className={s.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={s.title}>Log in to your account</div>
          <input
            {...register('login', {
              required: true,
            })}
            type="text"
            placeholder="Login"
            name="login"
            autoComplete="off"
          />
          <input
            {...register('password', {
              required: true,
            })}
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
          />
          <button type="submit" disabled={!isValid}>
            login
          </button>
          <p className={s.message}>
            Not registered? <NavLink to="/signup">Create an account</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };
