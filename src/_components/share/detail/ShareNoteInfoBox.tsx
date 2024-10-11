import { ITastingNoteDetailInfo } from "@/_types";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
}

export default function ShareNoteInfoBox({ info }: Props) {
  if (!info) {
    return <div></div>;
  }

  return (
    <section className="mt-4 flex h-[102px] flex-col gap-6 px-3">
      <div className="text-[24px] font-bold"> {info.alcoholicDrinksName}</div>

      <div className="grid w-full grid-cols-4">
        <div className="flex flex-col">
          <span className="text-cool-grayscale-500">주종</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.alcoholTypeName}
          </span>
        </div>

        <div className="flex flex-col text-cool-grayscale-500">
          <span className="text-cool-grayscale-500">도수</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.alcoholContent} %
          </span>
        </div>

        <div className="col-span-2 flex flex-col text-cool-grayscale-500">
          <span className="text-cool-grayscale-500">양조장</span>
          <span className="font-bold text-cool-grayscale-800">
            {info.breweryName}
          </span>
        </div>
      </div>
    </section>
  );
}
