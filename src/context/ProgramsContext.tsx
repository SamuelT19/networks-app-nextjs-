"use client";

import React, { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";
import { programsReducer, initialState } from "./ProgramsReducer";
import { State, Action } from "./types";

// Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface ProgramsContextType {
  state: State;
  dispatch: Dispatch<Action>;
}
const ProgramsContext = createContext<ProgramsContextType | undefined>(undefined);

export const useProgramsContext = () => {
  const context = useContext(ProgramsContext);
  if (context === undefined) {
    throw new Error("useProgramsContext must be used within a ProgramsProvider");
  }
  return context;
};

interface ProgramsProviderProps {
  children: ReactNode;
}
export const ProgramsProvider: React.FC<ProgramsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(programsReducer, initialState);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ProgramsContext.Provider value={{ state, dispatch }}>
        {children}
      </ProgramsContext.Provider>
    </LocalizationProvider>
  );
};
