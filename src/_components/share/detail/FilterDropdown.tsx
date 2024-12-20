"use client";

import { boolean } from "yup";
import { ReactNode, useState } from "react";
import useClickOutside from "@/_utils/hooks/useClickOutside";
import useFilterOrderByStore, { filterList } from "@/_store/filterOrderby";

interface Props {
  children: ReactNode;
  selectedCallback: () => void;
}

export default function FilterDropdown({ children, selectedCallback }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { selectedFilterOrderBy, setSelectedFilterOrderBy } =
    useFilterOrderByStore();
  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
    selectedCallback();
  }, isOpen);

  return (
    <div ref={ref} className={"relative flex items-center"}>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className={
          "text-[16px] font-normal leading-[24px] text-cool-grayscale-500"
        }
      >
        {children}
      </button>

      {isOpen && (
        <ul className="absolute -left-7 top-6 z-50 w-[120px] origin-top transform animate-slide-down rounded-[8px] bg-white px-1 py-2 shadow-[0px_4px_8px_0px_#00000014]">
          {filterList.map((item, index) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <li
                key={key}
                className="cursor-pointer overflow-hidden whitespace-nowrap px-4 py-2 text-[14px] leading-[21px] hover:bg-gray-100"
                onClick={() => {
                  setIsOpen(false);
                  selectedCallback();

                  setSelectedFilterOrderBy({ key: value });
                }}
              >
                {value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
