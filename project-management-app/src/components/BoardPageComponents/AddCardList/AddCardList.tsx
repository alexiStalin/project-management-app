import React, { useState, DragEvent, RefObject, createRef } from 'react';
import { BoardColumn, BoardColumnTask, BoardTitle } from '../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  changeBoard,
  changeCurrentCard,
  changeCurrentColumnOrder,
  fetchGetBoardById,
} from '../../../store/boardsSlice';
import s from './AddCardList.module.css';
import {
  fetchCreateTask,
  fetchDeleteTask,
  fetchGetAllTasks,
  fetchUpdateTask,
} from '../../../store/tasksSlice';

type MyProps = {
  data: BoardColumn;
  orderColumn: number;
};

const AddCardList = (props: MyProps) => {
  const [view, setView] = useState(false);
  const dispatch = useAppDispatch();
  const { board, currentCard, currentColumnOrder } = useAppSelector((state) => state.boards);
  const boardId = useAppSelector((state) => state.boards.boardId) as string;
  const userId = useAppSelector((state) => state.authorization.user?.id);

  const columnId = props.data.id;
  const title: RefObject<HTMLInputElement> = createRef();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (title.current !== null) {
      const titleNewTask = title.current.value;
      if (titleNewTask !== '' && boardId !== null) {
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

            await dispatch(
              fetchCreateTask([boardId, columnId, titleNewTask, order, 'null', userId])
            );
            await dispatch(fetchGetBoardById(boardId));

            if (title.current !== null) {
              title.current.value = '';
            }
          }
        });
      }
    }

    e.preventDefault();
  };

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';
    }
    dispatch(changeCurrentCard(card));
    dispatch(changeCurrentColumnOrder(Number(target.dataset.order)));
  };

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';
    }
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';
    }
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 4px 3px gray';
    }
  };

  const dropHandler = async (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    const boardCopy: BoardTitle = JSON.parse(JSON.stringify(board));

    if (boardCopy.columns !== undefined && currentCard !== null) {
      const currentBoard = boardCopy.columns.find(
        (column) => column.order === currentColumnOrder
      ) as BoardColumn;
      const dropBoard = boardCopy.columns.find(
        (column) => column.order === Number(target.dataset.order)
      ) as BoardColumn;
      if (currentBoard.order === dropBoard.order) {
        currentBoard.tasks?.sort((a, b) => a.order - b.order);
        const currentIndex = currentBoard.tasks?.findIndex(
          (el) => el.id === currentCard.id
        ) as number;
        const dropIndex = dropBoard.tasks?.findIndex((el) => el.id === card.id) as number;
        currentBoard.tasks?.splice(currentIndex, 1);
        dropBoard.tasks?.splice(dropIndex, 0, currentCard);
        if (currentBoard.tasks !== undefined) {
          const data: [string, string, string, string, number, string, string][] = [];
          for (let i = dropIndex; i < currentBoard.tasks.length; i += 1) {
            data.push([
              boardId as string,
              currentBoard.id,
              currentBoard.tasks[i].id,
              currentBoard.tasks[i].title,
              currentBoard.tasks[dropIndex].order + i + 1,
              currentBoard.tasks[i].description,
              userId as string,
            ]);
            const promises = data.map((arr) => {
              return dispatch(fetchUpdateTask(arr));
            });
            await Promise.all(promises).then(console.log).catch(console.error);
            await dispatch(fetchGetBoardById(boardId));
          }
        }
      } else {
        dispatch(fetchDeleteTask([boardId, currentBoard.id, currentCard.id]));

        if (
          dropBoard.tasks !== undefined &&
          boardId !== undefined &&
          userId !== undefined &&
          boardId !== null
        ) {
          dropBoard.tasks?.sort((a, b) => a.order - b.order);

          const dropIndex = dropBoard.tasks?.findIndex((el) => el.id === card.id) as number;
          dropBoard.tasks?.splice(dropIndex, 0, currentCard);

          const maxOrder = dropBoard.tasks.reduce(
            (prev, cur) => (cur.order > prev.order ? cur : prev),
            {
              order: -Infinity,
            }
          );
          const order = maxOrder.order === -Infinity ? 1 : maxOrder.order + 1;

          if (dropBoard.tasks !== undefined) {
            await dispatch(
              fetchCreateTask([
                boardId,
                dropBoard.id,
                currentCard.title,
                order,
                currentCard.description,
                userId,
              ])
            );

            const data: [string, string, string, string, number, string, string][] = [];
            for (let i = dropIndex + 1; i < dropBoard.tasks.length; i += 1) {
              data.push([
                boardId as string,
                dropBoard.id,
                dropBoard.tasks[i].id,
                dropBoard.tasks[i].title,
                order + i,
                dropBoard.tasks[i].description,
                userId as string,
              ]);

              const promises = data.map((arr) => {
                return dispatch(fetchUpdateTask(arr));
              });
              await Promise.all(promises).then(console.log).catch(console.error);

              await dispatch(fetchGetBoardById(boardId));
            }
          }
        }
      }
    }

    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';
    }
  };

  const renderCards = () => {
    if (props.data.tasks !== undefined) {
      if (props.data.tasks.length !== 0) {
        const sortTasks: BoardColumnTask[] = JSON.parse(JSON.stringify(props.data.tasks));
        sortTasks.sort((a, b) => a.order - b.order);
        return sortTasks.map((card) => {
          return (
            <div
              className={s.cardPoint}
              key={card.id}
              draggable={true}
              onDragStart={(e) => dragStartHandler(e, card)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropHandler(e, card)}
              data-order={props.orderColumn}
            >
              {card.title}
            </div>
          );
        });
      }
    }
  };
  const content = renderCards();

  return (
    <div className={s.container}>
      <div className={s.listTitleContainer}>
        <h2 className={s.listTitle}>{props.data.title}</h2>
        <div className={s.listTitleMove}>...</div>
      </div>
      <>{content}</>
      <button
        onClick={() => setView(true)}
        className={s.addCardBtn}
        style={{ display: view ? 'none' : 'block' }}
      >
        <span></span>
        <span className={s.iconAdd}>+ Add a card</span>
      </button>
      <div style={{ display: view ? 'block' : 'none' }}>
        <form onSubmit={handleSubmit}>
          <input
            className={s.inputTitle}
            ref={title}
            type="text"
            name="title"
            placeholder="Enter a title for this card..."
          ></input>
          <button className={s.addCardBtnCreate} type="submit">
            Add card
          </button>
        </form>
        <button className={s.close} onClick={() => setView(false)}>
          x
        </button>
      </div>
    </div>
  );
};

export { AddCardList };
