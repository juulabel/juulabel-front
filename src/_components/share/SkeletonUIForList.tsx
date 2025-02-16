import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function SkeletomUIForList() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-hidden px-4 py-6">
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
      <div className={"flex w-full flex-col gap-2"}>
        <Skeleton borderRadius={8} duration={0.8} className={"aspect-[3/4]"} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
        <Skeleton height={24} borderRadius={8} duration={0.8} />
      </div>
    </div>
  );
}
