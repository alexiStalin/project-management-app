import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { _apiBase } from './constant';
import {
  AutorizationInitialState,
  UserAuthorization,
  UserLogin,
  User,
  UserToken,
  Token,
} from './types';
import jwt_decode from 'jwt-decode';

const initialState: AutorizationInitialState = {
  auth: false,
  token: '',
  user: null,
  error: null,
  password: null,
};

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
>('authorization/getUserByToken', async function (token, { rejectWithValue }) {
  const user: UserToken = jwt_decode(token);
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

const fetchChangeUserParams = createAsyncThunk<
  User,
  string[],
  {
    rejectValue: string;
  }
>('authorization/fetchChangeUserParams', async function (arr, { rejectWithValue }) {
  const [token, name, login, password] = arr;
  const user: UserToken = jwt_decode(token);
  const userNewParams: UserAuthorization = { name: name, login: login, password: password };
  const response = await fetch(`${_apiBase}/users/${user.userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userNewParams),
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data = await response.json();
  const newUser = { id: data.id, login: data.login, name: data.name };
  return newUser as User;
});

const fetchDeleteUser = createAsyncThunk<
  void,
  string,
  {
    rejectValue: string;
  }
>('authorization/fetchDeleteUser', async function (token, { rejectWithValue }) {
  const user: UserToken = jwt_decode(token);
  const response = await fetch(`${_apiBase}/users/${user.userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
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
      state.password = null;
    },
    tokenAdd: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    deleteError: (state) => {
      state.error = null;
    },
    savePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      localStorage.setItem('password', action.payload);
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
      .addCase(fetchChangeUserParams.fulfilled, (state, action) => {
        state.user = action.payload;
        state.auth = true;
      })
      .addCase(fetchChangeUserParams.rejected, (state, action) => {
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
      })
      .addCase(fetchDeleteUser.fulfilled, (state) => {
        localStorage.clear();
        state.auth = false;
        state.token = '';
        state.user = null;
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
export const { login, logOut, tokenAdd, deleteError, savePassword } = actions;
export { fetchSignUp, fetchSignIn, fetchUserByToken, fetchChangeUserParams, fetchDeleteUser };

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
