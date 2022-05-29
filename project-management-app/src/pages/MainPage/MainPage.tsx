import { useState } from 'react';
import { SettingList } from '../../components/MainPageComponents/SettingList/SettingList';
import BoardsList from '../../components/MainPageComponents/BoardsList/BoardsList';

import { useTranslation } from 'react-i18next';

import s from './MainPage.module.css';
import { ListItemIcon, MenuItem } from '@mui/material';
import { Settings } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';

const MainPage = () => {
  const [state, setState] = useState(true);
  const { t } = useTranslation();

  return (
    <>
      <div className={s.container}>
        <div>
          <nav>
            <MenuItem onClick={() => setState(true)}>
              <ListItemIcon>
                <ArticleIcon fontSize="small" />
              </ListItemIcon>
              {t('boards')}
            </MenuItem>
            <MenuItem onClick={() => setState(false)}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              {t('settings')}
            </MenuItem>
          </nav>
        </div>
        <div>{state ? <BoardsList /> : <SettingList />}</div>
      </div>
    </>
  );
};

export { MainPage };
