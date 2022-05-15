import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchGetBoardById } from '../../store/boardsSlice';
import { BoardTitle, BoardColumn } from '../../store/types';
import { AddListButton } from '../../components/BoardPageComponents/AddListButton/AddListButton';
import { RootState } from '../../store/store';
import { AddCardList } from '../../components/BoardPageComponents/AddCardList/AddCardList';
import { connect } from 'react-redux';

const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.boards.board);

  useEffect(() => {
    if (id) {
      dispatch(fetchGetBoardById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderColumn = (board: BoardTitle) => {
    if (board?.columns !== undefined) {
      if (board.columns.length !== 0) {
        const sortBoard: BoardColumn[] = JSON.parse(JSON.stringify(board.columns));
        sortBoard.sort((a, b) => a.order - b.order);
        return sortBoard.map((data) => <AddCardList data={data} key={data.id} />);
      }
    }
  };

  let content;
  if (board !== undefined && board !== null) {
    content = renderColumn(board);
  }

  return (
    <div>
      <h1>BoardPage</h1>
      <>{content}</>
      <AddListButton></AddListButton>
    </div>
  );
};

// export { BoardPage };
export default connect((state: RootState) => ({ active: state.boards.board }))(BoardPage);
