import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { fetchSignIn, fetchSignUp } from '../../store/autorizationSlice';
import s from '../SignUpPage/SignUpPage.module.css';

type Data = {
  login: string;
  password: string;
};

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

  const onSubmit = (data: Data) => {
    console.log(data);
    dispatch(fetchSignIn(data));
    reset();
  };

  return (
    <div className={s.loginPage}>
      <div className={s.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('login', {
              required: true,
            })}
            type="text"
            placeholder="Login"
            name="login"
          />
          <input
            {...register('password', {
              required: true,
            })}
            type="password"
            placeholder="Password"
            name="password"
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
