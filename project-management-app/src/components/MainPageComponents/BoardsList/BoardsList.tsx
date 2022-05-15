import { useEffect, RefObject, createRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { BoardTitle } from '../../../store/types';
import BoardItem from '../BoardItem/BoardItem';
import { fetchGetAllBoards, fetchCreateBoard } from '../../../store/boardsSlice';

const BoardsList = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const token = useAppSelector((state) => state.authorization.token);
  const dispatch = useAppDispatch();
  const newBoardTitle: RefObject<HTMLInputElement> = createRef();

  useEffect(() => {
    dispatch(fetchGetAllBoards(token));
  });

  //
  const renderBoards = () => {
    if (boards !== null) {
      if (boards.length !== 0) {
        return boards.map((item: BoardTitle) => (
          <li key={item.id}>
            <BoardItem id={item.id} title={item.title} />
          </li>
        ));
      }
    }
  };
  const content = renderBoards();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newBoardTitle.current !== null) {
      const newBoard = newBoardTitle.current.value;
      if (newBoard !== '') {
        dispatch(fetchCreateBoard([token, newBoard]));
        dispatch(fetchGetAllBoards(token));
        newBoardTitle.current.value = '';
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={newBoardTitle}
          type="text"
          name="title"
          autoComplete="off"
          placeholder="Enter board name"
        ></input>
        <button type="submit">Create new board</button>
      </form>

      <ul>{content}</ul>
    </>
  );
};

export { BoardsList };
