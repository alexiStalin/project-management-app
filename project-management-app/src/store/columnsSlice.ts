import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { _apiBase } from './constant';
import { ColumnGet, ColumnCreate, BoardColumn, ColumnsInitialState } from './types';

const initialState: ColumnsInitialState = {
  title: null,
  id: null,
  error: null,
  columns: null,
  column: null,
};

const fetchGetAllColumns = createAsyncThunk<
  ColumnGet[],
  string,
  {
    rejectValue: string;
  }
>('columns/fetchGetAllColumns', async function (boardId, { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${_apiBase}/boards/${boardId}/columns`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: ColumnGet[] = await response.json();
  return data;
});

const fetchCreateColumn = createAsyncThunk<
  ColumnCreate,
  [string, string, number],
  {
    rejectValue: string;
  }
>('columns/fetchCreateColumn', async function ([boardId, title, order], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const body = { title: title, order: order };
  const response = await fetch(`${_apiBase}/boards/${boardId}/columns`, {
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
  const data: ColumnCreate = await response.json();
  return data;
});

const fetchGetColumnById = createAsyncThunk<
  BoardColumn,
  string[],
  {
    rejectValue: string;
  }
>('columns/fetchGetColumnById', async function ([boardId, columnId], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${_apiBase}/boards/${boardId}/columns/${columnId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardColumn = await response.json();
  return data;
});

const fetchDeleteColumn = createAsyncThunk<
  void,
  string[],
  {
    rejectValue: string;
  }
>('columns/fetchDeleteColumn', async function ([boardId, columnId], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${_apiBase}/boards/${boardId}/columns/${columnId}`, {
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

const fetchUpdateColumn = createAsyncThunk<
  ColumnCreate,
  [string, string, string, number],
  {
    rejectValue: string;
  }
>(
  'columns/fetchUpdateColumn',
  async function ([boardId, columnId, title, order], { rejectWithValue }) {
    const token = localStorage.getItem('token') || '';
    const body = { title: title, order: order };
    const response = await fetch(`${_apiBase}/boards/${boardId}/columns/${columnId}`, {
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
    const data: ColumnCreate = await response.json();
    return data;
  }
);

const BoardsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    // changeBoard: (state, action: PayloadAction<BoardTitle>) => {
    //   state.board = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(fetchCreateColumn.fulfilled, (state) => {})
      .addCase(fetchGetColumnById.fulfilled, (state, action) => {
        state.column = action.payload;
      })
      .addCase(fetchDeleteColumn.fulfilled, (state) => {})
      .addCase(fetchUpdateColumn.fulfilled, (state) => {})
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = BoardsSlice;

export default reducer;
export const {} = actions;
export {
  fetchGetAllColumns,
  fetchCreateColumn,
  fetchGetColumnById,
  fetchDeleteColumn,
  fetchUpdateColumn,
};

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
