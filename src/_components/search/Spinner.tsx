import { cn } from "@/_utils/commons";

interface SpinnerProps {
  className?: string;
  spinnerVisibility: boolean;
}

export default function Spinner({
  spinnerVisibility,
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative mb-[45px] flex h-12 w-12 items-center justify-center rounded-full bg-white opacity-0 shadow",
        spinnerVisibility && "opacity-1",
        className,
      )}
    >
      <div
        className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-cool-grayscale-500 dark:text-cool-grayscale-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
