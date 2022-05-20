import { useState, RefObject, createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';
import { fetchCreateColumn, fetchGetAllColumns } from '../../../store/columnsSlice';
import { RootState } from '../../../store/store';

import s from './AddColumn.module.css';

const AddColumn = () => {
  const [view, setView] = useState(false);
  // const boardId = useAppSelector((state) => state.boards.boardId);
  const columns = useAppSelector((state) => state.columns.columns);
  const dispatch = useAppDispatch();
  const title: RefObject<HTMLInputElement> = createRef();
  const { boardId } = useParams();

  useEffect(() => {
    if (boardId !== undefined) {
      dispatch(fetchGetAllColumns(boardId));
      dispatch(fetchGetBoardById(boardId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.current !== null && boardId !== undefined) {
      const titleNewTask = title.current.value;
      if (titleNewTask !== '' && boardId !== null && columns !== null) {
        const maxOrder = columns.reduce((prev, cur) => (cur.order > prev.order ? cur : prev), {
          order: -Infinity,
        });
        const order = maxOrder.order === -Infinity ? 1 : maxOrder.order + 1;
        title.current.value = '';
        setView(false);
        await dispatch(fetchCreateColumn([boardId, titleNewTask, order]));
        await dispatch(fetchGetBoardById(boardId));
        await dispatch(fetchGetAllColumns(boardId));
      }
    }
  };

  return (
    <div className={!view ? s.container : s.containerActive}>
      <button
        onClick={() => setView(true)}
        className={s.addListBtn}
        style={{ display: view ? 'none' : 'block' }}
      >
        <span></span>
        <span className={s.iconAdd}>+ Add a list</span>
      </button>
      <div style={{ display: view ? 'block' : 'none' }}>
        <form onSubmit={handleSubmit}>
          <input
            className={s.inputTitle}
            ref={title}
            type="text"
            name="title"
            placeholder="Enter list title..."
          ></input>
          <button className={s.addListBtnCreate} type="submit">
            Add list
          </button>
        </form>
        <button className={s.close} onClick={() => setView(false)}>
          x
        </button>
      </div>
    </div>
  );
};

// export { AddColumn };
export default connect((state: RootState) => ({ active: state.columns.columns }))(AddColumn);
