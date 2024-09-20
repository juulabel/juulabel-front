"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import TopHeader from "@/_common/TopHeader";
import axios from "axios";
import { Fragment } from "react";

export default function Page() {
  const { id } = useParams();
  const {
    data: termsDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["termsDetail"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/terms/${Number(id)}`,
      );
      if (response.data) return response.data.result;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error : {error.message}</div>;
  const convertNewLinesToBreaks = (text: string) => {
    return text.split("\r\n").map((line: string, index: number) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };
  return (
    <div className="h-full w-full max-w-[560px]">
      <TopHeader
        rest={0}
        step={0}
        title={`${termsDetail.title} ${termsDetail.is_required ? "(필수)" : "(선택)"}`}
      />
      {convertNewLinesToBreaks(termsDetail.content)}
    </div>
  );
}
