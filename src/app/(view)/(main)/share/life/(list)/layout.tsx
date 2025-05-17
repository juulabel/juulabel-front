"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import ShareLayout from "@/_components/share/ShareLayout";
import { ILifeList } from "@/_types/share";

interface LifeListContextProps {
  lifeListData: ILifeList[] | null;
  setLifeListData: (data: ILifeList[] | null) => void;
}

const LifeListContext = createContext<LifeListContextProps | undefined>(
  undefined,
);

export default function Layout({ children }: { children: ReactNode }) {
  const [lifeListData, setLifeListData] = useState<ILifeList[] | null>(null);
  return (
    <LifeListContext.Provider
      value={{
        lifeListData,
        setLifeListData,
      }}
    >
      <ShareLayout>{children}</ShareLayout>
    </LifeListContext.Provider>
  );
}
