import { useEffect, useState, RefObject, createRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchGetBoardById } from '../../../store/boardsSlice';
import { fetchCreateColumn, fetchGetAllColumns } from '../../../store/columnsSlice';

import s from './AddColumn.module.css';

const AddColumn = () => {
  const [view, setView] = useState(false);
  const boardId = useAppSelector((state) => state.boards.boardId);
  const columns = useAppSelector((state) => state.columns.columns);
  const dispatch = useAppDispatch();
  const title: RefObject<HTMLInputElement> = createRef();

  // useEffect(() => {
  //   if (boardId !== null) {
  //     dispatch(fetchGetAllColumns(boardId));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.current !== null && boardId !== null) {
      const titleNewTask = title.current.value;
      dispatch(fetchGetAllColumns(boardId));
      if (titleNewTask !== '' && boardId !== null && columns !== null) {
        const maxOrder = columns.reduce((prev, cur) => (cur.order > prev.order ? cur : prev), {
          order: -Infinity,
        });
        const order = maxOrder.order + 1;
        dispatch(fetchCreateColumn([boardId, titleNewTask, order]));
        title.current.value = '';
        dispatch(fetchGetBoardById(boardId));
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

export { AddColumn };
