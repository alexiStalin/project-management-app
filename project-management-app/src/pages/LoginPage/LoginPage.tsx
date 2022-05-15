import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  fetchSignIn,
  fetchUserByToken,
  deleteError,
  savePassword,
} from '../../store/autorizationSlice';
import { Token } from '../../store/types';
import s from '../SignUpPage/SignUpPage.module.css';

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
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(deleteError());
    // eslint-disable-next-line
  }, []);

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

  const error = useAppSelector((state) => state.authorization.error);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = (location.state as LocationState)?.from || '/main';

  const onSubmit = (data: Data) => {
    dispatch(savePassword(data.password));
    dispatch(fetchSignIn(data)).then((data) => {
      if (typeof data.payload !== 'string') {
        dispatch(fetchUserByToken((data.payload as Token).token));
        reset();
        navigate(fromPage, { replace: true });
      }
    });
  };

  return (
    <div className={s.loginPage}>
      <div className={s.form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            dispatch(deleteError());
          }}
        >
          <div className={s.title}>Log in to your account</div>
          <span className={s.messageError}>{error}</span>
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
