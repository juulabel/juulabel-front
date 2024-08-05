import { cn } from "@/_utils/commons";
import { cva } from "class-variance-authority";

interface ICaption {
  children: React.ReactNode;
  type: "primary" | "secondary" | "tertiary" | "outline" | null | undefined;
  className?: string;
}

const CaptionVariants = cva("", {
  variants: {
    type: {
      primary: "bg-primary-700 text-white",
      secondary: "bg-secondary text-white",
      tertiary: "bg-cool-grayscale-200 text-cool-grayscale-800",
      outline: "border-cool-grayscale-200 text-cool-grayscale-800",
    },
  },
});

export default function Caption({ children, type, className }: ICaption) {
  return (
    <div
      className={cn(
        CaptionVariants({ type }),
        className,
        "rounded px-2 py-[5px]",
      )}
    >
      <div className="text-center text-xs font-bold">{children}</div>
    </div>
  );
}
