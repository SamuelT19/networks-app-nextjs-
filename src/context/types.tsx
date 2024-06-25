export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}
type Role = {
  id: number;
  name: string;
};

export interface UserWithRole {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
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
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "TOGGLE_WATCH_LATER"; payload: string }
  | { type: "SET_USER"; payload: UserWithRole };
