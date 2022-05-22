import Modal from '../../Modal/Modal';
import { useForm } from 'react-hook-form';
import { fetchUpdateTask } from '../../../store/tasksSlice';
import { useAppDispatch } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';
import { BoardColumnTask } from '../../../store/types';

import s from './style.module.css';

type Data = {
  title: string;
  description: string;
};

type MyProps = {
  boardId: string;
  columnId: string;
  userId: string | undefined;
  onModalClose: (active: boolean) => void;
  isOpen: boolean;
  card: BoardColumnTask;
};

const ModalUpdateTask = (props: MyProps) => {
  const { boardId, columnId, userId, isOpen, onModalClose, card } = props;
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Data>({
    shouldFocusError: true,
  });

  const onSubmit = async (data: Data) => {
    if (userId !== undefined) {
      await dispatch(
        fetchUpdateTask([
          boardId,
          columnId,
          card.id,
          data.title,
          card.order,
          data.description,
          userId,
        ])
      );

      onModalClose(false);
      reset();
      await dispatch(fetchGetBoardById(boardId));
    }
  };
  return (
    <Modal isOpened={isOpen} title={'Update the task'} onModalClose={onModalClose} reset={reset}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <span className={s.messageError}>{errors?.title?.message}</span>
        <input
          {...register('title', {
            required: 'Enter a title',
          })}
          type="text"
          placeholder="Enter a title for this card..."
          autoComplete="off"
          className={s.inputTitle}
          defaultValue={card.title}
        />
        <span className={s.messageError}>{errors?.description?.message}</span>
        <input
          {...register('description', {
            required: 'Enter a description',
          })}
          type="text"
          placeholder="Enter a description for this card..."
          autoComplete="off"
          className={s.inputTitle}
          defaultValue={card.description}
        />
        <button className={s.addCardBtnCreate} type="submit">
          Update
        </button>
      </form>
    </Modal>
  );
};

export default ModalUpdateTask;
