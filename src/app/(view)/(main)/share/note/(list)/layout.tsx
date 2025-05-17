"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import ShareLayout from "@/_components/share/ShareLayout";
import { ITastingNoteResponse } from "@/_types";

interface TastingNoteContextProps {
  tastingNoteData: ITastingNoteResponse | null;
  setTastingNoteData: (data: ITastingNoteResponse | null) => void;
}

const TastingNoteContext = createContext<TastingNoteContextProps | undefined>(
  undefined,
);

export default function Layout({ children }: { children: ReactNode }) {
  const [tastingNoteData, setTastingNoteData] =
    useState<ITastingNoteResponse | null>(null);

  return (
    <TastingNoteContext.Provider
      value={{ tastingNoteData, setTastingNoteData }}
    >
      <ShareLayout>{children}</ShareLayout>
    </TastingNoteContext.Provider>
  );
}
