import { useEffect, RefObject, createRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { BoardTitle } from '../../../store/types';
import BoardItem from '../BoardItem/BoardItem';
import { fetchGetAllBoards, fetchCreateBoard } from '../../../store/boardsSlice';
import { connect } from 'react-redux';
import { RootState } from '../../../store/store';

const BoardsList = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const token = useAppSelector((state) => state.authorization.token);
  const dispatch = useAppDispatch();
  const newBoardTitle: RefObject<HTMLInputElement> = createRef();

  useEffect(() => {
    dispatch(fetchGetAllBoards(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newBoardTitle.current !== null) {
      const newBoard = newBoardTitle.current.value;
      if (newBoard !== '') {
        newBoardTitle.current.value = '';
        await dispatch(fetchCreateBoard([token, newBoard]));
        await dispatch(fetchGetAllBoards(token));
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

// export { BoardsList };
export default connect((state: RootState) => ({ active: state.boards.boards }))(BoardsList);
