"use client";
import { ReactNode, useEffect, useRef, useState, MouseEvent } from "react";
import useVolumePriceStore from "@/_store/volumePriceStore";
import useClickOutside from "@/_utils/hooks/useClickOutside";

interface Props {
  children: ReactNode;
  selectedCallback: () => void;
}

export default function TraditionalLiquorDropDown({
  children,
  selectedCallback,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { volumePriceDetails, setSelectedVolumePriceDetails } =
    useVolumePriceStore((state) => ({
      setSelectedVolumePriceDetails: state.setSelectedVolumePriceDetails,
      volumePriceDetails: state.volumePriceDetails,
    }));

  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
    selectedCallback();
  }, isOpen);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {}, [volumePriceDetails, isOpen]);

  return (
    <div ref={ref} className={"flex items-center"}>
      <button
        onClick={(e: MouseEvent) => {
          toggle();
        }}
      >
        {children}
      </button>
      {isOpen && (
        <ul className="absolute -left-2 top-6 w-[120px] origin-top transform animate-slide-down rounded-[8px] bg-white shadow-[0px_4px_8px_0px_#00000014]">
          {volumePriceDetails.map((detail) => (
            <li
              key={detail.volume}
              className="cursor-pointer px-4 py-2 text-[14px] hover:bg-gray-100"
              onClick={() => {
                toggle();
                selectedCallback();

                setSelectedVolumePriceDetails(detail);
              }}
            >
              {detail.volume} ml
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
