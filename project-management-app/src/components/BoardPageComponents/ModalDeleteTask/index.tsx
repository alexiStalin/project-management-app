import { BoardColumnTask } from '../../../store/types';
import Modal from '../../Modal/Modal';
import { useTranslation } from 'react-i18next';
import s from './style.module.css';

type MyProps = {
  deleteTask: (card: BoardColumnTask) => void;
  onModalClose: (active: boolean) => void;
  card: BoardColumnTask;
  isOpen: boolean;
};

const ModalDeleteTask = (props: MyProps) => {
  const { isOpen, deleteTask, onModalClose, card } = props;
  const { t } = useTranslation();
  return (
    <Modal isOpened={isOpen} title={t('do_you_want_delete_task')} onModalClose={onModalClose}>
      <button className={s.btnYes} onClick={() => deleteTask(card)}>
        {t('yes')}
      </button>
      <button className={s.btnNo} onClick={() => onModalClose(false)}>
        {t('no')}
      </button>
    </Modal>
  );
};

export default ModalDeleteTask;
