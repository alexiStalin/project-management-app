import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

const initialState: InitialState = {
  auth: false,
  token: '',
  user: null,
  error: null,
};

type InitialState = {
  auth: boolean;
  token: string;
  user: User | null;
  error: string | null;
};

type UserAuthorization = {
  name: string;
  login: string;
  password: string;
};

type UserLogin = {
  login: string;
  password: string;
};

type User = {
  id: string;
  name: string;
  login: string;
};

export type Token = {
  token: string;
};

const _apiBase = 'https://deploy-board.herokuapp.com';

const fetchSignUp = createAsyncThunk<
  User,
  UserAuthorization,
  {
    rejectValue: string;
  }
>('authorization/signUp', async function (user: UserAuthorization, { rejectWithValue }) {
  const response = await fetch(`${_apiBase}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(String(data.message));
  }
  const data: User = await response.json();
  return data;
});

const fetchSignIn = createAsyncThunk<
  Token,
  UserLogin,
  {
    rejectValue: string;
  }
>('authorization/signin', async function (userAuthorization, { rejectWithValue }) {
  const response = await fetch(`${_apiBase}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(userAuthorization),
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data = await response.json();
  return data as Token;
});

const fetchUserByToken = createAsyncThunk<
  User,
  string,
  {
    rejectValue: string;
  }
>('authorization/gitUserByToken', async function (token, { rejectWithValue }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = jwt_decode(token);
  const response = await fetch(`${_apiBase}/users/${user.userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data = await response.json();
  localStorage.setItem('token', token);
  return data as User;
});

const AuthorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    login: (state) => {
      state.auth = true;
    },
    logOut: (state) => {
      localStorage.clear();
      state.auth = false;
      state.token = '';
      state.user = null;
    },
    tokenAdd: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    deleteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignUp.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSignUp.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchSignIn.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.auth = true;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.auth = true;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.auth = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = AuthorizationSlice;

export default reducer;
export const { login, logOut, tokenAdd, deleteError } = actions;
export { fetchSignUp, fetchSignIn, fetchUserByToken };

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
