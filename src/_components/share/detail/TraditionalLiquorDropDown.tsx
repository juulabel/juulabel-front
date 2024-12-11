"use client";
import { ReactNode, useEffect, useRef, useState, MouseEvent } from "react";
import useVolumePriceStore from "@/_store/volumePriceStore";

interface Props {
  children: ReactNode;
  selectedCallback: () => void;
}

const items: Record<string, string> = {
  "1": "500ml",
  "2": "935ml",
  "3": "2L",
};

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      selectedCallback();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [volumePriceDetails, isOpen]);

  return (
    <div ref={dropdownRef} className={"flex items-center"}>
      <button
        onClick={(e: MouseEvent) => {
          toggle();
        }}
      >
        {children}
      </button>
      {isOpen && (
        <ul className="absolute -left-2 top-6 w-[120px] rounded-[8px] bg-white shadow-[0px_4px_8px_0px_#00000014]">
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
