import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchSignUp, deleteError } from '../../store/autorizationSlice';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

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
          <div className={s.title}>{t('sign_up_acc')}</div>
          <span className={s.messageError}>{errors?.name?.message}</span>
          <input
            {...register('name', {
              required: t('name_err'),
              minLength: 2,
            })}
            type="text"
            placeholder={t('name_reg')}
            name="name"
            autoComplete="off"
          />
          <span className={s.messageError}>{error}</span>
          <span className={s.messageError}>{errors?.login?.message}</span>
          <input
            {...register('login', {
              required: t('login_err'),
              minLength: 2,
            })}
            type="text"
            placeholder={t('login')}
            name="login"
            autoComplete="off"
            onChange={() => {
              dispatch(deleteError());
            }}
          />
          <span className={s.messageError}>{errors?.password?.message}</span>
          <input
            {...register('password', {
              required: t('pass_err'),
              minLength: 2,
            })}
            type="password"
            placeholder={t('password')}
            name="password"
            autoComplete="off"
          />
          <button type="submit" disabled={!isValid}>
            {t('create')}
          </button>
          <p className={s.messageError}>
            {t('already_registered')} <NavLink to="/login">{t('log_in')}</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export { SignUpPage };
