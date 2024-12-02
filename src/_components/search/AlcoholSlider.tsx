import Image from "next/image";
import { alcoholType } from "@/_config/alcoholType";
import { IAlcoholTypeTab } from "@/_types/search/alcoholTypeTab";

interface AlcoholSliderProps {
  onAlcoholTypeClick: (tab: IAlcoholTypeTab) => void; // Use the type here
}

export default function AlcoholSlider({
  onAlcoholTypeClick,
}: AlcoholSliderProps) {
  return (
    <div className="flex w-full flex-col px-4 pt-2">
      <div className="flex">
        <p className="text-base font-medium leading-normal text-slate-800">
          전통주 주종별
        </p>
        <p className="text-base font-normal leading-normal text-slate-600">
          로 찾아보세요.
        </p>
      </div>
      <div className="flex w-full items-center space-x-3 overflow-x-scroll pt-4 scrollbar-hide">
        {alcoholType.map((drink) => (
          <div
            key={drink.key}
            className="flex flex-col items-center justify-center"
          >
            <div
              
              className={`flex h-[74px] w-[74px] items-center justify-center rounded-full bg-cool-grayscale-100`}
            >
              <button
                onClick={() =>
                  onAlcoholTypeClick({
                    id: drink.key,
                    value: drink.value,
                  })
                } // Trigger the handler on click
              >
                <Image
                  src={drink.image}
                  width={44}
                  height={52}
                  alt={drink.value}
                />
              </button>
            </div>
            <p className="whitespace-nowrap pt-2 text-center text-sm font-medium leading-[21px] text-slate-700">
              {drink.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
