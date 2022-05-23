import { useState } from 'react';
import { SettingList } from '../../components/MainPageComponents/SettingList/SettingList';
import BoardsList from '../../components/MainPageComponents/BoardsList/BoardsList';

import s from './MainPage.module.css';
import { ListItemIcon, MenuItem } from '@mui/material';
import { Settings } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';

const MainPage = () => {
  const [state, setState] = useState(true);

  return (
    <>
      <div className={s.container}>
        <div>
          <nav>
            <MenuItem onClick={() => setState(true)}>
              <ListItemIcon>
                <ArticleIcon fontSize="small" />
              </ListItemIcon>
              Boards
            </MenuItem>
            <MenuItem onClick={() => setState(false)}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
          </nav>
        </div>
        <div>{state ? <BoardsList /> : <SettingList />}</div>
      </div>
    </>
  );
};

export { MainPage };
