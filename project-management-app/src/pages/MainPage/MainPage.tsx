import { useState } from 'react';
import { SettingList } from '../../components/MainPageComponents/SettingList/SettingList';
import BoardsList from '../../components/MainPageComponents/BoardsList/BoardsList';

import s from './MainPage.module.css';

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
        </div>
        <div>{state ? <BoardsList /> : <SettingList />}</div>
      </div>
    </>
  );
};

export { MainPage };
