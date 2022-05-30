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
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

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
  const fromPage = (location.state as LocationState)?.from || '/';

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
          <div className={s.title}>{t('login_to_your_acc')}</div>
          <span className={s.messageError}>{error}</span>
          <input
            {...register('login', {
              required: true,
            })}
            type="text"
            placeholder={t('login')}
            name="login"
            autoComplete="off"
          />
          <input
            {...register('password', {
              required: true,
            })}
            type="password"
            placeholder={t('password')}
            name="password"
            autoComplete="off"
          />
          <button type="submit" disabled={!isValid}>
            {t('log_in')}
          </button>
          <p className={s.message}>
            {t('not_registered')} <NavLink to="/signup">{t('creare_an_acc')}</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };
