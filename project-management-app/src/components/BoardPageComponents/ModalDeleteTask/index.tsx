import { BoardColumnTask } from '../../../store/types';
import Modal from '../../Modal/Modal';
import s from './style.module.css';

type MyProps = {
  deleteTask: (card: BoardColumnTask) => void;
  onModalClose: (active: boolean) => void;
  card: BoardColumnTask;
  isOpen: boolean;
};

const ModalDeleteTask = (props: MyProps) => {
  const { isOpen, deleteTask, onModalClose, card } = props;
  return (
    <Modal
      isOpened={isOpen}
      title={'Do you really want to delete this task?'}
      onModalClose={onModalClose}
    >
      <button className={s.btnYes} onClick={() => deleteTask(card)}>
        Yes
      </button>
      <button className={s.btnNo} onClick={() => onModalClose(false)}>
        No
      </button>
    </Modal>
  );
};

export default ModalDeleteTask;
