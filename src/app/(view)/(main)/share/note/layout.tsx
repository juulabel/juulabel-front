"use client";

import { ITastingNoteResponse } from "@/_types";
import { createContext, ReactNode, useContext, useState } from "react";

interface TastingNoteContextProps {
  tastingNoteData: ITastingNoteResponse | null;
  setTastingNoteData: (data: ITastingNoteResponse | null) => void;
}

const TastingNoteContext = createContext<TastingNoteContextProps | undefined>(
  undefined,
);

export const useTastingNoteContext = () => {
  const context = useContext(TastingNoteContext);
  if (!context) {
    throw new Error(
      "useTastingNoteContext must be used within a TastingNoteContext.Provider",
    );
  }
  return context;
};

export default function Layout({ children }: { children: ReactNode }) {
  const [tastingNoteData, setTastingNoteData] =
    useState<ITastingNoteResponse | null>(null);

  return (
    <TastingNoteContext.Provider
      value={{ tastingNoteData, setTastingNoteData }}
    >
      {children}
    </TastingNoteContext.Provider>
  );
}
