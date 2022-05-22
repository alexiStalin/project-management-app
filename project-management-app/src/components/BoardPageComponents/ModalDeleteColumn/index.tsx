import Modal from '../../Modal/Modal';
import s from './style.module.css';

type MyProps = {
  deleteColumn: () => void;
  onModalClose: (active: boolean) => void;
  isOpen: boolean;
};

const ModalDeleteColumn = (props: MyProps) => {
  const { isOpen, deleteColumn, onModalClose } = props;
  return (
    <Modal
      isOpened={isOpen}
      title={'Do you really want to delete this column?'}
      onModalClose={onModalClose}
    >
      <button className={s.btnYes} onClick={deleteColumn}>
        Yes
      </button>
      <button className={s.btnNo}>No</button>
    </Modal>
  );
};

export default ModalDeleteColumn;
