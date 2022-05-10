import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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
  try {
    const response = await fetch(`${_apiBase}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(`${data.message}`);
    }
    const data: User = await response.json();
    return data;
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    console.log(message);
    return rejectWithValue(message);
  }
});

const fetchSignIn = createAsyncThunk<Token, UserLogin>(
  'authorization/signin',
  async function (userAuthorization, { rejectWithValue }) {
    try {
      const response = await fetch(`${_apiBase}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(userAuthorization),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(`${data.message}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

const fetchUserByToken = createAsyncThunk<User, string>(
  'authorization/gitUserByToken',
  async function (token, { rejectWithValue }) {
    try {
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
        throw new Error(`Could not fetch, status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem('token', token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

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
      .addCase(fetchSignUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
        state.user = action.payload;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchSignUp.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.auth = false;
      })
      .addCase(fetchSignIn.fulfilled, (state, action: PayloadAction<Token>) => {
        state.token = action.payload.token;
        state.auth = true;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchSignIn.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.auth = false;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.auth = true;
      })
      .addCase(fetchUserByToken.rejected, (state) => {
        state.auth = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = AuthorizationSlice;

export default reducer;
export const { login, logOut, tokenAdd, deleteError } = actions;
export { fetchSignUp, fetchSignIn, fetchUserByToken };
