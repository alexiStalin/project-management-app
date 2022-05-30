import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { fetchGetAllBoards, fetchDeleteBoard, fetchUpdateBoard } from '../../../store/boardsSlice';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import s from './BoardItem.module.css';
import style from '../../BoardPageComponents/AddCardList/AddCardList.module.css';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Container } from '@mui/system';
import Modal from '../../Modal/Modal';

type MyProps = {
  title: string;
  id: string;
};
type Data = {
  title: string;
};

const BoardItem = (props: MyProps) => {
  const token = useAppSelector((state) => state.authorization.token);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [modalActive, setModalActive] = useState({
    modalAddBoard: false,
    modalDeleteBoard: false,
    modalChangeBoard: false,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Data>({
    shouldFocusError: true,
  });

  const deleteBoard = async () => {
    await dispatch(fetchDeleteBoard([token, props.id]));
    await dispatch(fetchGetAllBoards(token));
  };

  const onSubmit = async (data: Data) => {
    reset();
    setModalActive({ ...modalActive, modalChangeBoard: false });
    await dispatch(fetchUpdateBoard([token, props.id, data.title]));
    await dispatch(fetchGetAllBoards(token));
  };

  const onModalClose = (active: boolean) => {
    reset();
    setModalActive({
      ...modalActive,
      modalAddBoard: active,
      modalDeleteBoard: active,
      modalChangeBoard: active,
    });
  };

  return (
    <>
      <Card sx={{ maxWidth: 250, backgroundColor: '#cccccc' }}>
        <Container>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <Button size="large" color="inherit">
                <Link to={`/board/${props.id}`} style={{ textDecoration: 'none' }}>
                  {props.title}
                </Link>
              </Button>
            </Typography>
          </CardContent>
          <CardActions>
            <Container>
              <Button
                size="small"
                onClick={() => setModalActive({ ...modalActive, modalChangeBoard: true })}
              >
                {t('change')}
              </Button>
              <Button
                size="small"
                onClick={() => setModalActive({ ...modalActive, modalDeleteBoard: true })}
              >
                {t('delete')}
              </Button>
            </Container>
          </CardActions>
        </Container>
      </Card>
      <Modal
        isOpened={modalActive.modalChangeBoard}
        title={t('change_b_title')}
        onModalClose={onModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className={s.messageError}>{errors?.title?.message}</span>
          <input
            {...register('title', {
              required: t('enter_a_title'),
            })}
            type="text"
            placeholder={t('enter_a_board_title')}
            autoComplete="off"
            className={style.inputTitle}
          />
          <button className={style.addCardBtnCreate} type="submit">
            {t('add_board')}
          </button>
        </form>
      </Modal>

      <Modal
        isOpened={modalActive.modalDeleteBoard}
        title={t('do_you_want_delete_board')}
        onModalClose={onModalClose}
      >
        <button className={style.btnYes} onClick={deleteBoard}>
          {t('yes')}
        </button>
        <button
          className={style.btnNo}
          onClick={() => setModalActive({ ...modalActive, modalDeleteBoard: false })}
        >
          {t('no')}
        </button>
      </Modal>
    </>
  );
};

export default BoardItem;
