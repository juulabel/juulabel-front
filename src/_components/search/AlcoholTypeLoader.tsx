import { cn } from "@/_utils/commons";

interface AlcoholTypeLoaderProps {
  spinnerVisibility: boolean;
}

export default function AlcoholTypeLoader({
  spinnerVisibility,
}: AlcoholTypeLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between pb-10",
      )}
    >
      <div
        className={cn(
          "relative mb-[45px] flex h-12 w-12 items-center justify-center rounded-full bg-white opacity-0 shadow",
          spinnerVisibility && "opacity-1",
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

      <div className="flex flex-row items-center">
        <p className="px-1 text-base font-normal text-cool-grayscale-500">
          찾으시는
        </p>
        <p className="text-base font-normal text-[#ff823b]">전통주가</p>
        <p className="px-1 text-base font-normal text-cool-grayscale-600">
          없으신가요?
        </p>
      </div>
      <div className="mt-4 flex h-[37px] cursor-pointer items-center justify-center rounded-[4px] bg-black px-3 py-2">
        <p className="text-sm font-bold text-white">
          직접 전통주 정보 입력하기
        </p>
      </div>
    </div>
  );
}
