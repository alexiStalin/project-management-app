import Modal from '../../Modal/Modal';
import { useForm } from 'react-hook-form';
import { fetchCreateTask, fetchGetAllTasks } from '../../../store/tasksSlice';
import { useAppDispatch } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';

import s from './ModalCreateTask.module.css';

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
};

const ModalCreateTask = (props: MyProps) => {
  const { boardId, columnId, userId, isOpen, onModalClose } = props;
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
    dispatch(fetchGetAllTasks([boardId, columnId])).then(async (tasks) => {
      if (
        typeof tasks.payload !== 'string' &&
        tasks.payload !== undefined &&
        userId !== undefined
      ) {
        const maxOrder = tasks.payload.reduce(
          (prev, cur) => (cur.order > prev.order ? cur : prev),
          {
            order: -Infinity,
          }
        );
        const order = maxOrder.order === -Infinity ? 1 : maxOrder.order + 1;

        onModalClose(false);
        reset();

        await dispatch(
          fetchCreateTask([boardId, columnId, data.title, order, data.description, userId])
        );
        await dispatch(fetchGetBoardById(boardId));
      }
    });
  };
  return (
    <Modal isOpened={isOpen} title={'Add a list'} onModalClose={onModalClose} reset={reset}>
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
        />
        <button className={s.addCardBtnCreate} type="submit">
          Add card
        </button>
      </form>
    </Modal>
  );
};

export default ModalCreateTask;
