import CommentsFooter from "@/_components/share/detail/comments/CommentsFooter";
import CommentsHeader from "@/_components/share/detail/comments/CommentsHeader";
import { PropsWithChildren } from "react";

export default function CommentsLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full">
      <CommentsHeader />
      {children}
      <CommentsFooter />
    </div>
  );
}
