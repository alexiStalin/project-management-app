export type AutorizationInitialState = {
  auth: boolean;
  token: string;
  user: User | null;
  error: string | null;
  password: string | null;
};

export type UserAuthorization = {
  name: string;
  login: string;
  password: string;
};

export type UserLogin = {
  login: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  login: string;
};

export type UserToken = {
  userId: string;
  name: string;
};

export type Token = {
  token: string;
};

export type BoardInitialState = {
  title: string | null;
  id: string | null;
  error: string | null;
  boards: BoardTitle[] | null;
  board: BoardTitle | null;
  currentCard: BoardColumnTask | null;
  currentColumn: BoardColumn | null;
  currentColumnOrder: number | null;
};

export type BoardTitle = {
  title: string;
  id: string;
  columns?: BoardColumn[];
};

export type BoardColumn = {
  id: string;
  title: string;
  order: number;
  tasks?: BoardColumnTask[];
};

export type BoardColumnTask = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  files: BoardFile[];
};

export type BoardFile = {
  filename: string;
  fileSize: number;
};

export type ColumnsInitialState = {
  title: string | null;
  id: string | null;
  error: string | null;
  columns: ColumnGet[] | null;
  column: ColumnGet | null;
};

export type ColumnGet = {
  id: string;
  title: string;
  order: number;
};

export type ColumnCreate = {
  id: string;
  title: string;
  order: number;
};

export type TaskCreate = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
};

export type TasksInitialState = {
  id: string | null;
  error: string | null;
  tasks: ColumnGet[] | null;
  task: ColumnGet | null;
};
