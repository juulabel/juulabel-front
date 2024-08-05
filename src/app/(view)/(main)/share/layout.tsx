import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-dvh w-full max-w-[560px] overflow-hidden">
      {children}
    </div>
  );
}
