import React, { RefObject, createRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  fetchSignUp,
  deleteError,
  fetchChangeUserParams,
  fetchDeleteUser,
  savePassword,
} from '../../../store/autorizationSlice';
import { useTranslation } from 'react-i18next';
import Modal from '../../Modal/Modal';
import s from './SettingList.module.css';
import style from '../../BoardPageComponents/AddCardList/AddCardList.module.css';

const SettingList = () => {
  const [modalActive, setModalActive] = useState(false);
  const dispatch = useAppDispatch();
  const { user, token, password } = useAppSelector((state) => state.authorization);
  const { t } = useTranslation();

  const name: RefObject<HTMLInputElement> = createRef();
  const login: RefObject<HTMLInputElement> = createRef();
  const passwordOld: RefObject<HTMLInputElement> = createRef();
  const passwordNew: RefObject<HTMLInputElement> = createRef();
  const passwordNewRepeat: RefObject<HTMLInputElement> = createRef();

  const handleSubmitName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.current !== null && user !== null) {
      const newName = name.current.value;
      if (newName !== '' && password !== null) {
        dispatch(fetchChangeUserParams([token, newName, user.login, password]));

        name.current.value = '';
      }
    }
  };

  const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login.current !== null && user !== null) {
      const newLogin = login.current.value;
      if (password !== null && newLogin !== '') {
        dispatch(fetchChangeUserParams([token, user.name, newLogin, password]));

        login.current.value = '';
      }
    }
  };
  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      passwordOld.current !== null &&
      user !== null &&
      passwordNew.current !== null &&
      passwordNewRepeat.current !== null &&
      password !== null
    ) {
      const newPassword = passwordNew.current.value;
      if (
        newPassword !== '' &&
        passwordOld.current.value === password &&
        passwordNew.current.value === passwordNewRepeat.current.value
      ) {
        dispatch(fetchChangeUserParams([token, user.name, user.login, newPassword]));
        dispatch(savePassword(newPassword));
        passwordOld.current.value = '';
        passwordNew.current.value = '';
        passwordNewRepeat.current.value = '';
      }
    }
  };

  const onModalClose = (active: boolean) => {
    setModalActive(active);
  };

  return (
    <>
      <div className={s.settingPage}>
        <form className={s.form} onSubmit={handleSubmitName}>
          <label className={s.title}>{t('change_your_name')}</label>
          <input
            ref={name}
            type="text"
            name="name"
            autoComplete="off"
            placeholder={t('enter_new_name')}
          ></input>

          <button type="submit">{t('save_changes')}</button>
        </form>
        <form className={s.form} onSubmit={handleSubmitLogin}>
          <label className={s.title}>{t('change_your_login')}</label>
          <input
            ref={login}
            type="text"
            name="login"
            autoComplete="off"
            placeholder={t('enter_new_login')}
          ></input>

          <button type="submit">{t('save_changes')}</button>
        </form>
        <form className={s.form} onSubmit={handleSubmitPassword}>
          <label className={s.title}>{t('change_your_password')}</label>
          <input
            ref={passwordOld}
            type="password"
            name="password"
            autoComplete="off"
            placeholder={t('enter_password')}
          ></input>
          <input
            ref={passwordNew}
            type="password"
            name="password"
            autoComplete="off"
            placeholder={t('enter_new_password')}
          ></input>
          <input
            ref={passwordNewRepeat}
            type="password"
            name="password"
            autoComplete="off"
            placeholder={t('repeat_new_password')}
          ></input>
          <button type="submit">{t('save_changes')}</button>
        </form>

        <button
          className={s.btn}
          onClick={() => setModalActive(true)}
          style={{ backgroundColor: '#af4c4c' }}
        >
          {t('delete_acc')}
        </button>
      </div>
      <Modal
        isOpened={modalActive}
        title={t('do_you_want_to_delete_acc')}
        onModalClose={onModalClose}
      >
        <button className={style.btnYes} onClick={() => dispatch(fetchDeleteUser(token))}>
          {t('yes')}
        </button>
        <button className={style.btnNo} onClick={() => setModalActive(false)}>
          {t('no')}
        </button>
      </Modal>
    </>
  );
};

export { SettingList };
