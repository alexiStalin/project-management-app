import React, { useState, DragEvent, useMemo } from 'react';
import { BoardColumn, BoardColumnTask, BoardTitle } from '../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import ModalCreateTask from '../ModalCreateTask/ModalCreateTask';
import {
  changeCurrentCard,
  changeCurrentColumnOrder,
  fetchGetBoardById,
} from '../../../store/boardsSlice';
import s from './AddCardList.module.css';
import { fetchCreateTask, fetchDeleteTask, fetchUpdateTask } from '../../../store/tasksSlice';
import { fetchDeleteColumn, fetchUpdateColumn } from '../../../store/columnsSlice';
import ModalDeleteColumn from '../ModalDeleteColumn';
import ModalDeleteTask from '../ModalDeleteTask';
import ModalUpdateTask from '../ModalUpdateTask';

type MyProps = {
  data: BoardColumn;
  orderColumn: number;
};

const AddCardList = (props: MyProps) => {
  const [modalActive, setModalActive] = useState({
    modalAddTask: false,
    modalUpdateTask: false,
    modalDeleteTask: false,
    modalDeleteColumn: false,
  });

  const dispatch = useAppDispatch();
  const { board, currentCard, currentColumnOrder } = useAppSelector((state) => state.boards);
  const boardId = useAppSelector((state) => state.boards.boardId) as string;
  const userId = useAppSelector((state) => state.authorization.user?.id);

  const columnId = props.data.id;

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    const target = e.target as HTMLDivElement;
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';

      dispatch(changeCurrentCard(card));
      dispatch(changeCurrentColumnOrder(Number(target.dataset.order)));
    }
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
    if (target.className == s.cardPoint) {
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
              await Promise.all(promises);
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
                await Promise.all(promises);

                await dispatch(fetchGetBoardById(boardId));
              }
            }
          }
        }
      }

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
            <div key={card.id}>
              <div
                className={s.cardPoint}
                draggable={true}
                onDragStart={(e) => dragStartHandler(e, card)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, card)}
                data-order={props.orderColumn}
              >
                <div className={s.taskCardContainer} style={{ pointerEvents: 'none' }}>
                  <div>
                    <h5 className={s.taskTitle}>{card.title}</h5>
                    <h6 className={s.taskDescription}>{card.description}</h6>
                  </div>
                  <div className={s.btnContainer}>
                    <button
                      style={{ pointerEvents: 'all' }}
                      className={s.taskEditBtn}
                      onClick={() => setModalActive({ ...modalActive, modalUpdateTask: true })}
                    >
                      🖉
                    </button>
                    <button
                      style={{ pointerEvents: 'all' }}
                      className={s.taskDeleteBtn}
                      onClick={() => setModalActive({ ...modalActive, modalDeleteTask: true })}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>

              <ModalDeleteTask
                isOpen={modalActive.modalDeleteTask}
                deleteTask={deleteTask}
                onModalClose={onModalClose}
                card={card}
              />
              <ModalUpdateTask
                card={card}
                boardId={boardId}
                columnId={columnId}
                userId={userId}
                onModalClose={onModalClose}
                isOpen={modalActive.modalUpdateTask}
              />
            </div>
          );
        });
      }
    }
  };

  const deleteColumn = async () => {
    await dispatch(fetchDeleteColumn([boardId, columnId]));
    await dispatch(fetchGetBoardById(boardId));
  };

  const deleteTask = async (card: BoardColumnTask) => {
    setModalActive({ ...modalActive, modalDeleteTask: false });
    await dispatch(fetchDeleteTask([boardId, columnId, card.id]));
    await dispatch(fetchGetBoardById(boardId));
  };

  const onModalClose = (active: boolean) => {
    setModalActive({
      ...modalActive,
      modalAddTask: active,
      modalDeleteTask: active,
      modalDeleteColumn: active,
      modalUpdateTask: active,
    });
  };

  const content = renderCards();

  const [columnTitleChange, setColumnTitleChange] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      const target = e.target as HTMLInputElement;

      if (target.value !== '') {
        setColumnTitleChange(false);
        await dispatch(fetchUpdateColumn([boardId, columnId, target.value, props.data.order]));
        await dispatch(fetchGetBoardById(boardId));
      }
    }
  };

  return (
    <div className={s.listContainer}>
      <div className={s.container}>
        <div className={s.listTitleContainer}>
          <div>
            <span className={s.columnMove}>...</span>
            <span onClick={() => setColumnTitleChange(true)} style={{ pointerEvents: 'all' }}>
              {!columnTitleChange ? (
                <h2 className={s.listTitle}>{props.data.title}</h2>
              ) : (
                <>
                  <input
                    className={s.columnTitleInput}
                    type="text"
                    onBlur={() => setColumnTitleChange(false)}
                    onKeyDown={handleKeyDown}
                    defaultValue={props.data.title}
                  />
                </>
              )}
            </span>
          </div>

          <div
            className={s.columnDelete}
            onClick={() => setModalActive({ ...modalActive, modalDeleteColumn: true })}
          >
            ␡
          </div>
        </div>
        <>{content}</>
        <button
          onClick={() => setModalActive({ ...modalActive, modalAddTask: true })}
          className={s.addCardBtn}
        >
          <span></span>
          <span className={s.iconAdd}>+ Add a card</span>
        </button>
      </div>
      <ModalCreateTask
        boardId={boardId}
        columnId={columnId}
        userId={userId}
        onModalClose={onModalClose}
        isOpen={modalActive.modalAddTask}
      />

      <ModalDeleteColumn
        isOpen={modalActive.modalDeleteColumn}
        onModalClose={onModalClose}
        deleteColumn={deleteColumn}
      />
    </div>
  );
};

export { AddCardList };
