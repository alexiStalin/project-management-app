import Modal from '../../Modal/Modal';
import s from './style.module.css';
import { useTranslation } from 'react-i18next';

type MyProps = {
  deleteColumn: () => void;
  onModalClose: (active: boolean) => void;
  isOpen: boolean;
};

const ModalDeleteColumn = (props: MyProps) => {
  const { t } = useTranslation();
  const { isOpen, deleteColumn, onModalClose } = props;
  return (
    <Modal isOpened={isOpen} title={t('do_you_want_to_delete_column')} onModalClose={onModalClose}>
      <button className={s.btnYes} onClick={deleteColumn}>
        {t('yes')}
      </button>
      <button className={s.btnNo} onClick={() => onModalClose(false)}>
        {t('no')}
      </button>
    </Modal>
  );
};

export default ModalDeleteColumn;
