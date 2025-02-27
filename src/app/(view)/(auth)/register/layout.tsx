import { PropsWithChildren } from "react";

export default function RegisterLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full max-w-[560px] overflow-hidden overflow-y-scroll pt-16 scrollbar-hide">
      {children}
    </div>
  );
}
