import Navigation from "@/_common/Navigation";
import SearchHeader from "@/_components/search/SearchHeader";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full max-w-[560px]">
      <SearchHeader />
      <div className="h-full w-full max-w-[560px]">{children}</div>
      <Navigation />
    </div>
  );
}
