"use client";

import Loading from "@/_common/Loading";
import { alcoholType } from "@/_config/alcoholType";
import { getAlcoholTypes } from "@/app/api/auth/register/getAlcoholTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

interface IPreferredAlcohol {
  alcoholTypes: string[];
  onChangeAlcoholType: (value: string) => void;
}

export default function PreferredAlcoholForm({
  alcoholTypes = [],
  onChangeAlcoholType,
}: IPreferredAlcohol) {
  const {
    data: alcoholTypeList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alcoholTypes"],
    queryFn: getAlcoholTypes,
  });
  const handlePreferredAlcohol = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    event.preventDefault();
    onChangeAlcoholType(value);
  };
  if (isLoading) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <div className="mx-[4%] mt-6 flex flex-row flex-wrap">
      {alcoholType.map((drink) => (
        <div
          key={drink.key}
          className="mx-[1%] flex flex-col items-center justify-center"
        >
          <div
            className={`mx-[1%] flex h-28 w-28 items-center justify-center rounded-full ${
              alcoholTypes && alcoholTypes.includes(drink.value)
                ? "border-2 border-[#FF823C] bg-[#FF823C] bg-opacity-10"
                : "bg-cool-grayscale-100"
            }`}
          >
            <button
              onClick={(event) => handlePreferredAlcohol(event, drink.value)}
            >
              <Image
                src={drink.image}
                width={66}
                height={78}
                alt={drink.value}
              />
            </button>
          </div>
          <p>{drink.value}</p>
        </div>
      ))}
    </div>
  );
}
