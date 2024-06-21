export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
}

export interface Movie {
  Title: string;
  Runtime: string;
  Poster: string;
}

export interface State {
  user: User | null;
  favorites: string[];
  watchLater: string[];
}

export type Action =
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'TOGGLE_WATCH_LATER'; payload: string }
  | { type: 'SET_USER'; payload: User };