import React, { useState, DragEvent } from 'react';
import { BoardColumn, BoardColumnTask, BoardTitle } from '../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { changeBoard, changeCurrentCard } from '../../../store/boardsSlice';
import s from './AddCardList.module.css';

type MyProps = {
  data: BoardColumn;
};

const AddCardList = (props: MyProps) => {
  const [view, setView] = useState(false);
  // const [currentCard, setCurrentCard] = useState<BoardColumnTask | null>(null);
  // const [cardList, setCardList] = useState<BoardColumn>(props.data);
  const dispatch = useAppDispatch();
  const { board, currentCard } = useAppSelector((state) => state.boards);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    dispatch(changeCurrentCard(card));
    // setCurrentCard(card);
  };

  // const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {};

  const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.style.background = '#fff';
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    target.style.background = 'lightgray';
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>, card: BoardColumnTask) => {
    e.preventDefault();
    const cardList = props.data;

    if (cardList.tasks !== undefined) {
      if (currentCard !== null) {
        const indexCard = cardList.tasks.indexOf(card);
        const indexCurrentCard = cardList.tasks.indexOf(currentCard);

        [cardList.tasks[indexCard], cardList.tasks[indexCurrentCard]] = [
          cardList.tasks[indexCurrentCard],
          cardList.tasks[indexCard],
        ];
      }
    }
    const indexColumn = board?.columns?.findIndex((el) => el.id === cardList.id) as number;
    if (board !== null) {
      if (board.columns !== undefined) {
        const changeBoards: BoardTitle = JSON.parse(JSON.stringify(board));
        if (changeBoards.columns !== undefined) {
          changeBoards.columns[indexColumn] = cardList;
          console.log(changeBoards);
          dispatch(changeBoard(changeBoards));
        }
      }
    }

    const target = e.target as HTMLDivElement;

    target.style.background = '#fff';
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
              // onDragLeave={(e) => dragLeaveHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropHandler(e, card)}
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
