import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

const initialState: InitialState = {
  auth: false,
  token: '',
  user: {},
};

type InitialState = {
  auth: boolean;
  token: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: User | {};
};

type UserAuthorization = {
  name: string;
  login: string;
  password: string;
};

type UserGetToken = {
  login: string;
  password: string;
};

type User = {
  id: string;
  name: string;
  login: string;
};

type Token = {
  token: string;
};

const _apiBase = 'https://deploy-board.herokuapp.com';

const fetchSignUp = createAsyncThunk<User, UserAuthorization>(
  'authorization/signin',
  async function (userGetToken, { rejectWithValue }) {
    try {
      const response = await fetch(`${_apiBase}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(userGetToken),
      });
      if (!response.ok) {
        throw new Error(`Could not fetch, status: ${response.status}`);
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

const fetchSignIn = createAsyncThunk<Token, UserGetToken>(
  'authorization/signup',
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
        throw new Error(`Could not fetch, status: ${response.status}`);
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
      state.user = {};
    },
    tokenAdd: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(fetchSignUp.rejected, (state) => {
        state.auth = false;
      })
      .addCase(fetchSignIn.fulfilled, (state, action: PayloadAction<Token>) => {
        state.token = action.payload.token;
        state.auth = true;
      })
      .addCase(fetchSignIn.rejected, (state) => {
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
export const { login, logOut, tokenAdd } = actions;
export { fetchSignUp, fetchSignIn, fetchUserByToken };
