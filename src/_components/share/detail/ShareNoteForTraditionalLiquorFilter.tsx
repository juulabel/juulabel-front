"use client";

import FilterDropdown from "@/_components/share/detail/FilterDropdown";
import Image from "next/image";
import clsx from "clsx";
import { boolean } from "yup";
import { useState } from "react";
import useFilterOrderByStore from "@/_store/filterOrderby";

export default function ShareNoteForTraditionalLiquorFilter() {
  const [clicked, setClicked] = useState<boolean>(false);
  const { selectedFilterOrderBy } = useFilterOrderByStore();
  const toggle = () => {
    setClicked((prev) => !prev);
  };
  return (
    <FilterDropdown
      selectedCallback={() => {
        // setClicked(false);
      }}
    >
      {/*<div className={"flex items-center gap-1"}>*/}
      <span>{Object.values(selectedFilterOrderBy)[0]}</span>
      {/*<Image*/}
      {/*  src={"/svg/down_arrow.svg"}*/}
      {/*  alt={"v"}*/}
      {/*  className={clsx("cursor-pointer transition-transform duration-300", {*/}
      {/*    // "rotate-180": clicked,*/}
      {/*  })}*/}
      {/*  width={24}*/}
      {/*  height={24}*/}
      {/*  onClick={toggle}*/}
      {/*/>*/}
      {/*</div>*/}
    </FilterDropdown>
  );
}
