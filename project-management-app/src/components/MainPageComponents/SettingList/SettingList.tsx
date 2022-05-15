import React, { RefObject, createRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  fetchSignUp,
  deleteError,
  fetchChangeUserParams,
  fetchDeleteUser,
  savePassword,
} from '../../../store/autorizationSlice';
import s from './SettingList.module.css';

const SettingList = () => {
  const dispatch = useAppDispatch();
  const { user, token, password } = useAppSelector((state) => state.authorization);

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

  return (
    <>
      <div className={s.settingPage}>
        <form className={s.form} onSubmit={handleSubmitName}>
          <label className={s.title}>Change your name</label>
          <input
            ref={name}
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Enter new name"
          ></input>

          <button type="submit">Save changes</button>
        </form>
        <form className={s.form} onSubmit={handleSubmitLogin}>
          <label className={s.title}>Change your login</label>
          <input
            ref={login}
            type="text"
            name="login"
            autoComplete="off"
            placeholder="Enter new login"
          ></input>

          <button type="submit">Save changes</button>
        </form>
        <form className={s.form} onSubmit={handleSubmitPassword}>
          <label className={s.title}>Change your password</label>
          <input
            ref={passwordOld}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Enter password"
          ></input>
          <input
            ref={passwordNew}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Enter new password"
          ></input>
          <input
            ref={passwordNewRepeat}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Repeat new password"
          ></input>
          <button type="submit">Save changes</button>
        </form>

        <button className={s.btn} onClick={() => dispatch(fetchDeleteUser(token))}>
          Delete account
        </button>
      </div>
    </>
  );
};

export { SettingList };
