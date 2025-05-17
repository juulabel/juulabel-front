import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import getTraditionalLiquor from "@/app/api/tasting-note/getTraditionalLiquor";
import useVolumePriceStore from "@/_store/volumePriceStore";
import { IResponseTranditionalLiquor } from "@/_types/tasting-note/officialData";
import { IApiResponse } from "@/_types";

export default function useTraditionalLiquorList(id: number) {
  const { setVolumePriceDetails } = useVolumePriceStore((state) => ({
    setVolumePriceDetails: state.setVolumePriceDetails,
  }));
  const { data, isFetching, isError, isFetched } = useQuery<
    IApiResponse<IResponseTranditionalLiquor>
  >({
    queryKey: ["tranditional", id],
    queryFn: () => getTraditionalLiquor({ alcoholicDrinksId: id }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.result.volumePriceDetails) {
      setVolumePriceDetails(data.result.volumePriceDetails);
    }
  }, [isFetching]);

  return { data, isFetching, isError, isFetched };
}
