import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  auth: false,
  token: '',
};

const AuthorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    login: (state) => {
      state.auth = true;
    },
    logOut: (state) => {
      state.auth = false;
    },
    tokenAdd: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

const { actions, reducer } = AuthorizationSlice;

export default reducer;

export const { login, logOut } = actions;
