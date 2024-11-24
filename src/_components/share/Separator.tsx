import clsx from "clsx";

interface Props {
  className?: string;
}

export default function Separator({ className }: Props) {
  return (
    <div
      className={clsx("h-[8px] w-[1px] bg-cool-grayscale-300", className)}
    ></div>
  );
}
