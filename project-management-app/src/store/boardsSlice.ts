import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { _apiBase } from './constant';
import { BoardInitialState, BoardTitle } from './types';

const initialState: BoardInitialState = {
  title: null,
  id: null,
  error: null,
  boards: null,
};

const fetchGetAllBoards = createAsyncThunk<
  BoardTitle[],
  string,
  {
    rejectValue: string;
  }
>('boards/fetchGetAllBoards', async function (token, { rejectWithValue }) {
  const response = await fetch(`${_apiBase}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardTitle[] = await response.json();
  return data;
});

const fetchCreateBoard = createAsyncThunk<
  BoardTitle,
  string[],
  {
    rejectValue: string;
  }
>('boards/fetchCreateBoard', async function ([token, title], { rejectWithValue }) {
  const body = { title: title };
  const response = await fetch(`${_apiBase}/boards`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardTitle = await response.json();
  return data;
});

const fetchGetBoardById = createAsyncThunk<
  BoardTitle,
  string[],
  {
    rejectValue: string;
  }
>('boards/fetchGetBoardById', async function ([token, id], { rejectWithValue }) {
  const response = await fetch(`${_apiBase}/boards/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardTitle = await response.json();
  return data;
});

const fetchDeleteBoard = createAsyncThunk<
  void,
  string[],
  {
    rejectValue: string;
  }
>('boards/fetchDeleteBoard', async function ([token, id], { rejectWithValue }) {
  const response = await fetch(`${_apiBase}/boards/${id}`, {
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

const fetchUpdateBoard = createAsyncThunk<
  BoardTitle,
  string[],
  {
    rejectValue: string;
  }
>('boards/fetchUpdateBoard', async function ([token, id, title], { rejectWithValue }) {
  const body = { title: title };
  const response = await fetch(`${_apiBase}/boards/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardTitle = await response.json();
  return data;
});

const BoardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    tokenAdd: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchCreateBoard.fulfilled, (state) => {})
      .addCase(fetchGetBoardById.fulfilled, (state) => {})
      .addCase(fetchDeleteBoard.fulfilled, (state) => {})
      .addCase(fetchUpdateBoard.fulfilled, (state) => {})
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = BoardsSlice;

export default reducer;
export const { tokenAdd } = actions;
export {
  fetchGetAllBoards,
  fetchCreateBoard,
  fetchGetBoardById,
  fetchDeleteBoard,
  fetchUpdateBoard,
};

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
