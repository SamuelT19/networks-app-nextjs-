"use client";

import { State, Action } from "./types";
import { getUserFromLocalStorage } from "@/utils/localStorageHelpers";

export const initialState = {
  user: getUserFromLocalStorage(),
  favorites: [],
  watchLater: [],
};


export const programsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((title) => title !== action.payload)
          : [...state.favorites, action.payload],
      };
    case "TOGGLE_WATCH_LATER":
      return {
        ...state,
        watchLater: state.watchLater.includes(action.payload)
          ? state.watchLater.filter((title) => title !== action.payload)
          : [...state.watchLater, action.payload],
      };
      case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
