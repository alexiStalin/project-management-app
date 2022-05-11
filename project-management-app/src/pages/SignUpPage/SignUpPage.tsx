import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchSignUp, deleteError } from '../../store/autorizationSlice';
import s from './SignUpPage.module.css';

type Data = {
  name: string;
  login: string;
  password: string;
};

const SignUpPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(deleteError());
    // eslint-disable-next-line
  }, []);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<Data>({
    mode: 'onChange',
    shouldUnregister: true,
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const navigate = useNavigate();
  const error = useAppSelector((state) => state.authorization.error);

  const onSubmit = (data: Data) => {
    dispatch(fetchSignUp(data)).then((data) => {
      if (typeof data.payload !== 'string') {
        reset();
        navigate('../login', { replace: true });
      }
    });
  };

  return (
    <div className={s.loginPage}>
      <div className={s.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={s.title}>Sign up for your account</div>
          <span className={s.messageError}>{errors?.name?.message}</span>
          <input
            {...register('name', {
              required: 'Name must be of length 2 or higher',
              minLength: 2,
            })}
            type="text"
            placeholder="Name"
            name="name"
            autoComplete="off"
          />
          <span className={s.messageError}>{error}</span>
          <span className={s.messageError}>{errors?.login?.message}</span>
          <input
            {...register('login', {
              required: 'Login must be of length 2 or higher',
              minLength: 2,
            })}
            type="text"
            placeholder="Login"
            name="login"
            autoComplete="off"
            onChange={() => {
              dispatch(deleteError());
            }}
          />
          <span className={s.messageError}>{errors?.password?.message}</span>
          <input
            {...register('password', {
              required: 'Password must be of length 2 or higher',
              minLength: 2,
            })}
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
          />
          <button type="submit" disabled={!isValid}>
            create
          </button>
          <p className={s.messageError}>
            Already registered? <NavLink to="/login">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export { SignUpPage };
