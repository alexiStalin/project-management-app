import { useEffect, DragEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchGetBoardById, changeCurrentColumn, changeBoardId } from '../../store/boardsSlice';
import { BoardTitle, BoardColumn } from '../../store/types';
import AddColumn from '../../components/BoardPageComponents/AddColumn/AddColumn';
import { RootState } from '../../store/store';
import { AddCardList } from '../../components/BoardPageComponents/AddCardList/AddCardList';
import { connect } from 'react-redux';

import s from '../../components/BoardPageComponents/AddCardList/AddCardList.module.css';
import style from './style.module.css';
import { fetchUpdateColumn } from '../../store/columnsSlice';
import { fetchCreateTask, fetchDeleteTask } from '../../store/tasksSlice';

const BoardPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { board, currentCard, currentColumn } = useAppSelector((state) => state.boards);
  const userId = useAppSelector((state) => state.authorization.user?.id);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchGetBoardById(boardId));
      dispatch(changeBoardId(boardId));
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

  const dropCardHandler = async (e: DragEvent<HTMLDivElement>, data: BoardColumn) => {
    if (
      data.tasks !== undefined &&
      boardId !== undefined &&
      userId !== undefined &&
      currentColumn !== undefined &&
      currentColumn !== null
    ) {
      if (data.tasks.length === 0) {
        const boardCopy: BoardTitle = JSON.parse(JSON.stringify(board));
        if (boardCopy.columns !== undefined && currentCard !== null) {
          const dropBoardIndex = boardCopy?.columns.findIndex((el) => el.order === data.order);
          const dropBoard = boardCopy?.columns[dropBoardIndex];

          if (dropBoard.tasks !== undefined) {
            dropBoard.tasks.push(currentCard);
            await dispatch(
              fetchCreateTask([
                boardId,
                dropBoard.id,
                currentCard.title,
                1,
                currentCard.description,
                userId,
              ])
            );
          }

          await dispatch(fetchDeleteTask([boardId, currentColumn.id, currentCard.id]));
          await dispatch(fetchGetBoardById(boardId));
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
    if (target.className === s.columnMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className === s.columnMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnEndHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className === s.columnMove) {
      target.style.backgroundColor = '#ebecf0';
    }
  };
  const dragColumnOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className === s.columnMove) {
      target.style.backgroundColor = 'gray';
    }
  };

  const dropColumnHandler = async (e: DragEvent<HTMLDivElement>, data: BoardColumn) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className === s.columnMove) {
      if (data.tasks !== undefined && boardId !== undefined && currentColumn !== null) {
        const columns: BoardColumn[] = JSON.parse(JSON.stringify(board?.columns));
        columns?.sort((a, b) => a.order - b.order);
        const dropBoardIndex = columns.findIndex((el) => el.order === data.order);
        const currentBoardIndex = columns.findIndex((el) => el.order === currentColumn?.order);

        columns.splice(currentBoardIndex, 1);
        columns.splice(dropBoardIndex, 0, currentColumn as BoardColumn);
        const maxOrder = columns.reduce((prev, cur) => (cur.order > prev.order ? cur : prev), {
          order: -Infinity,
        });
        const order = maxOrder.order === -Infinity ? 1 : maxOrder.order + 1;

        const arrPromises: [string, string, string, number][] = [];
        for (let i = dropBoardIndex; i < columns.length; i += 1) {
          arrPromises.push([boardId as string, columns[i].id, columns[i].title, order + i]);
        }

        const promises = arrPromises.map((arr) => {
          return dispatch(fetchUpdateColumn(arr));
        });
        await Promise.all(promises);
        await dispatch(fetchGetBoardById(boardId));

        target.style.backgroundColor = '#ebecf0';
      }
    }
  };

  const renderColumn = (board: BoardTitle) => {
    if (board?.columns !== undefined) {
      if (board.columns.length !== 0) {
        const sortBoard: BoardColumn[] = JSON.parse(JSON.stringify(board.columns));
        sortBoard.sort((a, b) => a.order - b.order);
        return sortBoard.map((data) => (
          <div
            // className={style.columnContainer}
            key={data.id}
            draggable={true}
            onDragStart={(e) => dragColumnStartHandler(e, data)}
            onDragLeave={(e) => dragColumnLeaveHandler(e)}
            onDragEnd={(e) => dragColumnEndHandler(e)}
            onDragOver={(e) => dragColumnOverHandler(e)}
            onDrop={(e) => dropColumnHandler(e, data)}
          >
            <div onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropCardHandler(e, data)}>
              <AddCardList orderColumn={data.order} data={data} />
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
      <div className={style.titleContainer}>
        <Link to={`/`} className={style.back}>
          <span className={style.arrowBack}>🢐</span>Back to main
        </Link>
        <h2 className={style.title}>{board?.title}</h2>
      </div>
      <>{content}</>
      <AddColumn></AddColumn>
    </div>
  );
};

export default connect((state: RootState) => ({ active: state.boards.board }))(BoardPage);
