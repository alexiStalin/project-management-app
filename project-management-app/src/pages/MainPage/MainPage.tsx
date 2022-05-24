import { useState } from 'react';
import { SettingList } from '../../components/MainPageComponents/SettingList/SettingList';
import BoardsList from '../../components/MainPageComponents/BoardsList/BoardsList';

import s from './MainPage.module.css';
import Modal from '../../components/Modal/Modal';

const MainPage = () => {
  const [state, setState] = useState(true);

  return (
    <>
      <h1>MainPage</h1>
      <div className={s.container}>
        <div>
          <nav>
            <ul>
              <li className={s.point} onClick={() => setState(true)}>
                Boards
              </li>
              <li className={s.point} onClick={() => setState(false)}>
                Setting
              </li>
            </ul>
          </nav>
          {/* <Modal isOpened={false} title={'Are you shure?'}>
            <form>
              <input type="text" name="title" placeholder="title"></input>
              <input type="text" name="description" placeholder="description"></input>
              <button type="submit">Create</button>
            </form>
          </Modal> */}
        </div>
        <div>{state ? <BoardsList /> : <SettingList />}</div>
      </div>
    </>
  );
};

export { MainPage };
