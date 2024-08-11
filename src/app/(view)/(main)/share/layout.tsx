import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="relative h-full w-full max-w-[560px]">{children}</div>;
}
