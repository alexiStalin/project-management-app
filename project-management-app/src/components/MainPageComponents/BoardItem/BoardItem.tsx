import { useState, RefObject, createRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { fetchGetAllBoards, fetchDeleteBoard, fetchUpdateBoard } from '../../../store/boardsSlice';
import { Link } from 'react-router-dom';
import s from './BoardItem.module.css';

type MyProps = {
  title: string;
  id: string;
};

const BoardItem = (props: MyProps) => {
  const [changeTitle, setChangeTitle] = useState(false);
  const token = useAppSelector((state) => state.authorization.token);
  const dispatch = useAppDispatch();
  const newBoardTitle: RefObject<HTMLInputElement> = createRef();

  const deleteBoard = async () => {
    await dispatch(fetchDeleteBoard([token, props.id]));
    await dispatch(fetchGetAllBoards(token));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newBoardTitle.current !== null) {
      const newBoard = newBoardTitle.current.value;
      if (newBoard !== '') {
        setChangeTitle(false);
        newBoardTitle.current.value = '';
        await dispatch(fetchUpdateBoard([token, props.id, newBoard]));
        await dispatch(fetchGetAllBoards(token));
      }
    }
  };

  const changeBoard = (
    <form onSubmit={handleSubmit}>
      <input
        ref={newBoardTitle}
        type="text"
        name="title"
        autoComplete="off"
        placeholder="Enter board name"
      ></input>
      <button type="submit">Change</button>
    </form>
  );

  const showTitleChange = () => {
    setChangeTitle((changeTitle) => !changeTitle);
  };

  return (
    <div className={s.container}>
      <div className="img-container">
        <Link to={`/board/${props.id}`}>
          <h2 className={s.title} data-id={props.id}>
            {props.title}
          </h2>
        </Link>
        <button onClick={showTitleChange}>Change board title</button>
        {changeTitle ? changeBoard : null}
        <button onClick={deleteBoard}>Delete board</button>
      </div>
    </div>
  );
};

export default BoardItem;
