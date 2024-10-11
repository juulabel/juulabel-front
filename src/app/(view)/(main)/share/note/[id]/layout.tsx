import ShareHeader from "@/_components/share/detail/ShareHeader";
import React, { ReactNode } from "react";

export default function NoteDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full pb-[100px]">
      <ShareHeader />
      {children}
    </div>
  );
}
