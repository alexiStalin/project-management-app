import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { _apiBase } from './constant';
import { BoardColumnTask, TaskCreate, TasksInitialState } from './types';

const initialState: TasksInitialState = {
  id: null,
  error: null,
  tasks: null,
  task: null,
};

const fetchGetAllTasks = createAsyncThunk<
  BoardColumnTask[],
  string[],
  {
    rejectValue: string;
  }
>('tasks/fetchGetAllTasks', async function ([boardId, columnId], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${_apiBase}/boards/${boardId}/columns/${columnId}/tasks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: BoardColumnTask[] = await response.json();
  return data;
});

const fetchCreateTask = createAsyncThunk<
  TaskCreate,
  [string, string, string, number, string, string],
  {
    rejectValue: string;
  }
>(
  'tasks/fetchCreateTask',
  async function ([boardId, columnId, title, order, description, userId], { rejectWithValue }) {
    const token = localStorage.getItem('token') || '';
    const body = { title: title, order: order, description: description, userId: userId };
    const response = await fetch(`${_apiBase}/boards/${boardId}/columns/${columnId}/tasks`, {
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
    const data: TaskCreate = await response.json();
    return data;
  }
);

const fetchGetTaskById = createAsyncThunk<
  TaskCreate,
  string[],
  {
    rejectValue: string;
  }
>('tasks/fetchGetTaskById', async function ([boardId, columnId, taskId], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(
    `${_apiBase}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
  const data: TaskCreate = await response.json();
  return data;
});

const fetchDeleteTask = createAsyncThunk<
  void,
  [string, string, string],
  {
    rejectValue: string;
  }
>('tasks/fetchDeleteTask', async function ([boardId, columnId, taskId], { rejectWithValue }) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(
    `${_apiBase}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.message as string);
  }
});

const fetchUpdateTask = createAsyncThunk<
  TaskCreate,
  [string, string, string, string, number, string, string],
  {
    rejectValue: string;
  }
>(
  'tasks/fetchUpdateTask',
  async function (
    [boardId, columnId, taskId, title, order, description, userId],
    { rejectWithValue }
  ) {
    const token = localStorage.getItem('token') || '';
    const body = {
      title: title,
      order: order,
      description: description,
      userId: userId,
      boardId: boardId,
      columnId: columnId,
    };
    const response = await fetch(
      `${_apiBase}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return rejectWithValue(data.message as string);
    }
    const data: TaskCreate = await response.json();
    return data;
  }
);

const BoardsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchGetTaskById.fulfilled, (state, action) => {
        state.task = action.payload;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = BoardsSlice;

export default reducer;
export const {} = actions;
export { fetchGetAllTasks, fetchCreateTask, fetchGetTaskById, fetchDeleteTask, fetchUpdateTask };

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
