import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';
import { fetchCreateColumn, fetchGetAllColumns } from '../../../store/columnsSlice';
import { RootState } from '../../../store/store';
import Modal from '../../Modal/Modal';

import s from './AddColumn.module.css';

type Data = {
  title: string;
};

const AddColumn = () => {
  const [modalActive, setModalActive] = useState({
    modalAddColumn: false,
    modalDeleteColumn: false,
  });

  const columns = useAppSelector((state) => state.columns.columns);
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  useEffect(() => {
    if (boardId !== undefined) {
      dispatch(fetchGetAllColumns(boardId));
      dispatch(fetchGetBoardById(boardId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Data>({
    shouldFocusError: true,
  });

  const onSubmit = async (data: Data) => {
    if (boardId !== null && columns !== null && boardId !== undefined) {
      const maxOrder = columns.reduce((prev, cur) => (cur.order > prev.order ? cur : prev), {
        order: -Infinity,
      });
      const order = maxOrder.order === -Infinity ? 1 : maxOrder.order + 1;
      reset();
      setModalActive({ ...modalActive, modalAddColumn: false, modalDeleteColumn: false });
      await dispatch(fetchCreateColumn([boardId, data.title, order]));
      await dispatch(fetchGetBoardById(boardId));
      await dispatch(fetchGetAllColumns(boardId));
    }
  };

  const onModalClose = (active: boolean) => {
    reset();
    setModalActive({ ...modalActive, modalAddColumn: active, modalDeleteColumn: active });
  };

  return (
    <>
      <div className={s.container}>
        <button
          onClick={() => setModalActive({ ...modalActive, modalAddColumn: true })}
          className={s.addListBtn}
        >
          <span></span>
          <span className={s.iconAdd}>+ Add a list</span>
        </button>
      </div>
      <Modal isOpened={modalActive.modalAddColumn} title={'Add a list'} onModalClose={onModalClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className={s.messageError}>{errors?.title?.message}</span>
          <input
            {...register('title', {
              required: 'Enter a title',
            })}
            type="text"
            placeholder="Enter list title..."
            autoComplete="off"
            className={s.inputTitle}
          />
          <button className={s.addListBtnCreate} type="submit">
            Add card
          </button>
        </form>
      </Modal>
    </>
  );
};

export default connect((state: RootState) => ({ active: state.columns.columns }))(AddColumn);
