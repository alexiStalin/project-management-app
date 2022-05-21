import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalInitialState } from './types';

const initialState: ModalInitialState = {
  isOpen: false,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalOpen: (state) => {
      state.isOpen = true;
    },
    modalClose: (state) => {
      state.isOpen = false;
    },
  },
});

const { actions, reducer } = ModalSlice;

export default reducer;
export const { modalOpen, modalClose } = actions;
