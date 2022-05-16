import React, { useState, DragEvent } from 'react';
import { BoardColumn, BoardColumnTask, BoardTitle } from '../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  changeBoard,
  changeCurrentCard,
  changeCurrentColumnOrder,
} from '../../../store/boardsSlice';
import s from './AddCardList.module.css';

type MyProps = {
  data: BoardColumn;
  orderColumn: number;
};

const AddCardList = (props: MyProps) => {
  const [view, setView] = useState(false);

  const dispatch = useAppDispatch();
  const { board, currentCard, currentColumnOrder } = useAppSelector((state) => state.boards);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const dropHandler = (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    const boardCopy: BoardTitle = JSON.parse(JSON.stringify(board));
    if (boardCopy.columns !== undefined && currentCard !== null) {
      const currentBoardIndex = boardCopy?.columns.findIndex(
        (el) => el.order === currentColumnOrder
      );
      const currentBoard: BoardColumn = boardCopy?.columns[currentBoardIndex];
      const currentIndex = currentBoard.tasks?.findIndex(
        (el) => el.id === currentCard.id
      ) as number;
      currentBoard.tasks?.splice(currentIndex, 1);

      const dropBoardIndex = boardCopy?.columns.findIndex(
        (el) => el.order === Number(target.dataset.order)
      );
      const dropBoard: BoardColumn = boardCopy?.columns[dropBoardIndex];
      if (dropBoard.tasks !== undefined) {
        const dropIndex = dropBoard.tasks?.findIndex((el) => el.id === card.id);
        dropBoard.tasks.splice(dropIndex + 1, 0, currentCard);
        dispatch(changeBoard(boardCopy));
      }
    }
    if (target.className == s.cardPoint) {
      target.style.boxShadow = '0 1px 0 #091e4240';
    }
  };

  const renderCards = () => {
    if (props.data.tasks !== undefined) {
      if (props.data.tasks.length !== 0) {
        return props.data.tasks.map((card) => {
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
          <textarea
            className={s.inputTitle}
            placeholder="Enter a title for this card..."
          ></textarea>
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
