import Modal from '../../Modal/Modal';
import { useForm } from 'react-hook-form';
import { fetchUpdateTask } from '../../../store/tasksSlice';
import { useAppDispatch } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';
import { BoardColumnTask } from '../../../store/types';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

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
    <Modal isOpened={isOpen} title={t('update_task')} onModalClose={onModalClose} reset={reset}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <span className={s.messageError}>{errors?.title?.message}</span>
        <input
          {...register('title', {
            required: t('enter_a_title'),
          })}
          type="text"
          placeholder={t('enter_title_for_task')}
          autoComplete="off"
          className={s.inputTitle}
          defaultValue={card.title}
        />
        <span className={s.messageError}>{errors?.description?.message}</span>
        <input
          {...register('description', {
            required: t('enter_task_description'),
          })}
          type="text"
          placeholder={t('enter_task_description_for_card')}
          autoComplete="off"
          className={s.inputTitle}
          defaultValue={card.description}
        />
        <button className={s.addCardBtnCreate} type="submit">
          {t('update')}
        </button>
      </form>
    </Modal>
  );
};

export default ModalUpdateTask;
