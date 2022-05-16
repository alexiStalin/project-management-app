import { useEffect, DragEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { changeBoard, fetchGetBoardById, changeCurrentColumn } from '../../store/boardsSlice';
import { BoardTitle, BoardColumn } from '../../store/types';
import { AddListButton } from '../../components/BoardPageComponents/AddListButton/AddListButton';
import { RootState } from '../../store/store';
import { AddCardList } from '../../components/BoardPageComponents/AddCardList/AddCardList';
import { connect } from 'react-redux';

import s from '../../components/BoardPageComponents/AddCardList/AddCardList.module.css';

const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { board, currentCard, currentColumnOrder, currentColumn } = useAppSelector(
    (state) => state.boards
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchGetBoardById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 4px 3px gray';
    }
  };

  const dropCardHandler = (e: DragEvent<HTMLDivElement>, data: BoardColumn) => {
    if (data.tasks !== undefined) {
      if (data.tasks.length === 0) {
        const boardCopy: BoardTitle = JSON.parse(JSON.stringify(board));
        if (boardCopy.columns !== undefined && currentCard !== null) {
          const dropBoardIndex = boardCopy?.columns.findIndex((el) => el.order === data.order);
          const dropBoard = boardCopy?.columns[dropBoardIndex];

          if (dropBoard.tasks !== undefined) {
            dropBoard.tasks.push(currentCard);
          }

          const currentBoardIndex = boardCopy?.columns.findIndex(
            (el) => el.order === currentColumnOrder
          );
          const currentBoard: BoardColumn = boardCopy?.columns[currentBoardIndex];
          const currentIndex = currentBoard.tasks?.findIndex(
            (el) => el.id === currentCard.id
          ) as number;
          currentBoard.tasks?.splice(currentIndex, 1);

          dispatch(changeBoard(boardCopy));
        }
        const target = e.target as HTMLDivElement;
        if (target.className == s.cardPoint) {
          target.style.boxShadow = '0 1px 0 #091e4240';
        }
      }
    }
  };

  const dragColumnStartHandler = (e: DragEvent<HTMLDivElement>, data: BoardColumn) => {
    const target = e.target as HTMLDivElement;
    dispatch(changeCurrentColumn(data));
    if (target.className === s.listTitleMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className === s.listTitleMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnEndHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className === s.listTitleMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className === s.listTitleMove) {
      target.style.backgroundColor = 'gray';
    }
  };
  const dropColumnHandler = (e: DragEvent<HTMLDivElement>, data: BoardColumn) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className === s.listTitleMove) {
      if (data.tasks !== undefined) {
        const boardCopy: BoardTitle = JSON.parse(JSON.stringify(board));
        if (boardCopy.columns !== undefined) {
          const dropBoardIndex = boardCopy?.columns.findIndex((el) => el.order === data.order);
          const dropBoard = boardCopy?.columns[dropBoardIndex];
          const dropBoardOrder = dropBoard.order;

          const currentBoardIndex = boardCopy?.columns.findIndex(
            (el) => el.order === currentColumn?.order
          );
          const currentBoard: BoardColumn = boardCopy?.columns[currentBoardIndex];
          const currentBoardOrder = currentBoard.order;

          currentBoard.order = dropBoardOrder;
          dropBoard.order = currentBoardOrder;

          dispatch(changeBoard(boardCopy));
        }

        target.style.backgroundColor = '#ebecf0';
      }
    }
  };

  const renderColumn = (board: BoardTitle) => {
    if (board?.columns !== undefined) {
      if (board.columns.length !== 0) {
        const sortBoard: BoardColumn[] = JSON.parse(JSON.stringify(board.columns));
        sortBoard.sort((a, b) => a.order - b.order);
        return sortBoard.map((data, index) => (
          <div
            key={data.id}
            draggable={true}
            onDragStart={(e) => dragColumnStartHandler(e, data)}
            onDragLeave={(e) => dragColumnLeaveHandler(e)}
            onDragEnd={(e) => dragColumnEndHandler(e)}
            onDragOver={(e) => dragColumnOverHandler(e)}
            onDrop={(e) => dropColumnHandler(e, data)}
          >
            <div onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropCardHandler(e, data)}>
              <AddCardList orderColumn={index + 1} data={data} />
            </div>
          </div>
        ));
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

export default connect((state: RootState) => ({ active: state.boards.board }))(BoardPage);
