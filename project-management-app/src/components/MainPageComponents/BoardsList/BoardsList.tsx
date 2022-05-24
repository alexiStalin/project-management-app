import { useEffect, RefObject, createRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { BoardTitle } from '../../../store/types';
import BoardItem from '../BoardItem/BoardItem';
import { fetchGetAllBoards, fetchCreateBoard } from '../../../store/boardsSlice';
import { connect } from 'react-redux';
import { RootState } from '../../../store/store';
import style from '../../BoardPageComponents/AddCardList/AddCardList.module.css';
import { Box, Button, Grid } from '@mui/material';

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
          <Grid item xs={12} md={4} key={item.id}>
            <BoardItem id={item.id} title={item.title} />
          </Grid>
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
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            className={style.inputTitle}
            style={{ margin: '0' }}
            ref={newBoardTitle}
            type="text"
            name="title"
            autoComplete="off"
            placeholder="Enter a board name"
          ></input>
          <Button type="submit">Create new board</Button>
        </Box>
      </form>

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          {content}
        </Grid>
      </Box>
    </>
  );
};

export default connect((state: RootState) => ({ active: state.boards.boards }))(BoardsList);
