import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

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

const fetchSignUp = createAsyncThunk<User, UserAuthorization>(
  'authorization/signin',
  async function (userGetToken, { rejectWithValue }) {
    try {
      const _apiBase = 'https://deploy-board.herokuapp.com';
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
      const _apiBase = 'https://deploy-board.herokuapp.com';
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
      })
      .addCase(fetchSignIn.rejected, (state) => {
        state.auth = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = AuthorizationSlice;

export default reducer;
export const { login, logOut } = actions;
export { fetchSignUp, fetchSignIn };
